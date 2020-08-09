class CustomDate {
  static toString(date) {
    if (typeof date === "string") date.replace(".000Z", "");
    let d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
  }
  static toText(date) {
    const dateFormat = {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const todayDate = new Date();
    const eventDate = new Date(date);
    const theTime = eventDate.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit" });
    const theDate = eventDate.toLocaleDateString("default", dateFormat);
    let second = (Date.parse(todayDate) - Date.parse(eventDate)) / 1000;
    if (Number.isNaN(second)) throw Error("Invalid Date(!)");
    let mins = Math.ceil(second / 60);
    let hrs = Math.round(mins / 60);
    let days = Math.round(hrs / 24);

    if (second < 0) {
      second = second * -1;
      mins = Math.ceil(second / 60);
      hrs = Math.round(mins / 60);
      days = Math.round(hrs / 24);
      if (second < 60) return `in less then a min`;
      if (mins < 60) return `in ${mins} mins`;
      if (todayDate.getDate() === eventDate.getDate()) return `today at ${theTime}`;
      if (todayDate.getDate() === eventDate.getDate() - 1) return `tomorrow at ${theTime}`;
      // if (days > 1 && days < 7) return `In ${days} days`;
      // if (days === 7) return `In a week ago`;
      return `on ${theDate}`;
    }
    if (second < 60) return `less then a min ago`;
    if (mins < 60) return `${mins} mins ago`;
    if (todayDate.getDate() === eventDate.getDate() && hrs < 24) return `${hrs} hrs ago`;
    if (todayDate.getDate() === eventDate.getDate() + 1 && days < 2) return `yesterday at ${theTime}`;
    if (days > 1 && days < 7) return `${days} days ago`;
    if (days === 7) return `a week ago`;
    return `${theDate}`;
  }
}
export default CustomDate;
