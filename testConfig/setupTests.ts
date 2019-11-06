import "@testing-library/jest-dom/extend-expect";
import axios from "axios";

function mockAxiosFunction<T>(...args: T[]) {
    console.warn("axios is not mocked for this call", ...args);
    return Promise.reject(new Error("This must be mocked!"));
}

beforeEach(() => {
    jest.spyOn(axios, "get").mockImplementation(mockAxiosFunction);
    jest.spyOn(axios, "post").mockImplementation(mockAxiosFunction);
    jest.spyOn(axios, "patch").mockImplementation(mockAxiosFunction);
    jest.spyOn(axios, "put").mockImplementation(mockAxiosFunction);
    jest.spyOn(axios, "delete").mockImplementation(mockAxiosFunction);
});

afterEach(() => {
    (axios.get as jest.Mock).mockRestore();
    (axios.post as jest.Mock).mockRestore();
    (axios.patch as jest.Mock).mockRestore();
    (axios.put as jest.Mock).mockRestore();
    (axios.delete as jest.Mock).mockRestore();
});
