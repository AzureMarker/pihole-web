export const validate = {
  domain(domain) {
    try {
      if (domain.length < 3) return false;
      return !!domain.match(/([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)+(\.([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*))*$/);
    } catch (err) {
      return false;
    }
  }
};
