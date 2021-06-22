import { Spammer } from "./spammer.js";

const spammer = new Spammer()

spammer.execute(["http://localhost:4000"], 1500, 10)
