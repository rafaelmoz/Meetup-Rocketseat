module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'meetupdatabase',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
