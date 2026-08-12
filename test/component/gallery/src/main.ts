import "../../../../src/app.css";
import { mount } from "svelte";
import ComponentContract from "./ComponentContract.svelte";

mount(ComponentContract, { target: document.querySelector("#app")! });
