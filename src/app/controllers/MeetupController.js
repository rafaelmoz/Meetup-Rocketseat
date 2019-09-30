import * as Yup from 'yup';
import { Op } from 'sequelize';
import { isBefore, startOfDay, endOfDay, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  /* Listagem dos Meetups */
  async index(req, res) {
    const where = {};
    const page = req.query.page || 1;

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      include: [User],
      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json(meetups);
  }

  /* Validação dos campos para Criação do Meetup */
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      file_id: Yup.number().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    /* Verifica se a validação dos dados estão Okay, se não estiverem da erro */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validaçao dos campos!' });
    }

    /* Verifica se a data passada já passou, se sim da erro */
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res
        .status(400)
        .json({ error: 'Não pode criar meetups com datas que já passaram!' });
    }

    const user_id = req.userId;

    /* Se tudo estiver Ok, faz a criação do Meetup */
    const meetup = await Meetup.create({
      ...req.body,
      user_id,
    });

    return res.json(meetup);
  }

  /* Validação dos campos para Alteração do Meetup */
  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      file_id: Yup.number(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação dos campos!' });
    }

    const user_id = req.userId;

    const meetup = await Meetup.findByPk(req.params.id);

    /* Verifica se quem está tentando alterar é o dono do Meetup, se não for
    da erro */
    if (meetup.user_id !== user_id) {
      return res.status(401).json({
        error: 'Seu usuário não é autorizado para alterar esse Meetup!',
      });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res
        .status(400)
        .json({ error: 'Não pode alterar meetups com datas que já passaram!' });
    }

    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'Não pode alterar meetups com datas que já passaram!' });
    }

    /* Se tudo estiver Ok, alterar o Meetup */
    await meetup.update(req.body);

    return res.json(meetup);
  }

  /* Deletar Meetups */
  async delete(req, res) {
    const user_id = req.userId;

    const meetup = await Meetup.findByPk(req.params.id);

    /* Verifica se o usuário que esta deletando o meetup é o dono do meetup */
    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'Not authorized.' });
    }

    /* Não se pode deletar meetups que já passaram */
    if (meetup.past) {
      return res.status(400).json({ error: "Can't delete past meetups." });
    }

    /* Se tudo estiver Ok, deleta o meetup do bando de dados */
    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupController();
