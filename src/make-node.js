const container = document.createElement(`div`);

export default (template) => {
  container.insertAdjacentHTML(`beforeend`, template);
  return container.firstChild;
};
