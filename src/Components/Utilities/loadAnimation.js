export default class LoadAnimation {
  static timeout = null;
  static show() {
    LoadAnimation.timeout = setTimeout(
      () =>
        document.querySelector(".loader-spinner")?.classList.remove("!hidden"),
      100,
    );
  }

  static hide() {
    clearTimeout(LoadAnimation.timeout);
    document.querySelector(".loader-spinner")?.classList.add("!hidden");
  }
}
