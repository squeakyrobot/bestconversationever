import { writable } from "svelte/store";

// This store is set in the layout on the after update
// event so it can be used by other pages in on mount 
// to return to the previous if needed 
export const returnPage = writable('/');