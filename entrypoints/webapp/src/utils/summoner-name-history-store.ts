export const summonerNameHistoryStore = {
  get: () => {
    return JSON.parse(localStorage.getItem("summonerNameHistory") || "[]") as {
      name: string;
      tag: string;
    }[];
  },
  add: (name: string, tag: string) => {
    const history = summonerNameHistoryStore.get();
    history.push({ name, tag });
    localStorage.setItem("summonerNameHistory", JSON.stringify(history));
  },
  clear: () => {
    localStorage.removeItem("summonerNameHistory");
  }
};
