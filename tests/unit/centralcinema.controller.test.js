const CentralCinemaController = require("../../controllers/centralcinema.controllers");
const User = require("../../models/user");
const httpMocks = require("node-mocks-http");
const newUser = require("../mock-data/new-user.json")

User.create = jest.fn();

let req, res, next;
beforeEach(() => {
    //Pozwala nam zarequestowac przykladowy request/response http ze strony www
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    //Przypisujemy do naszego zapytania przyklaowe dane (mock-data) dotyczace usera,
    req.body = newUser;
});

describe("CentralCinemaController.createNewUser", () =>{
    beforeEach(() => {
        req.body = newUser;
    })
    it("Sprawdz czy createNewUser jest funkcja", () => {
        expect(typeof CentralCinemaController.createNewUser).toBe("function");
    })
    it("Sprwadź czy createNewUser poprawnie uzywa funkcji User.create z parametrami", () =>{
        CentralCinemaController.createNewUser(req, res, next);
        expect(User.create).toBeCalledWith(newUser);
    });
    it("Powinien zostac zwrócony kod 201-> element stworzony", async () =>{
        await CentralCinemaController.createNewUser(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("Funkcja powinna zwrocic json body w odpowiedzi", async  () => {
        User.create.mockReturnValue(newUser);
        await CentralCinemaController.createNewUser(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newUser);
    })

    it("Funkcja posiada obsluge wyjatków", async () =>{
        const errorMessage = {message: "Brak wymaganego parametru"};
        const rejectedPromise = Promise.reject(errorMessage);
        //Obiekt Promise reprezentuje ewentualne zakończenie (lub porażkę)
        //asynchronicznej operacji i jej wartości.
        User.create.mockReturnValue(rejectedPromise)
        await CentralCinemaController.createNewUser(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});