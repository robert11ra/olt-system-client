import AlertMessage from "./alertMessage.jsx";
import promptWithComponent from "./promptWithComponent.jsx";

export default async function componentAlert(message, title="Atención", className) {
    return promptWithComponent((r) => (
      <AlertMessage resolve={r} text={message} title={title} className={className}/>
    ));
  };