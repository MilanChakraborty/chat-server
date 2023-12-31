const ROOT_DIR = process.env.PWD;

const serveHomePage = (_, res) => {
  res.sendFile(`${ROOT_DIR}/public/index.html`);
};

const respondNotFound = (_, res) => {
  res.status(404);
  res.sendFile(`${ROOT_DIR}/public/pages/not-found.html`);
};

module.exports = { serveHomePage, respondNotFound };
