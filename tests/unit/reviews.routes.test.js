const ReviewsController = require("../../controllers/reviews.controllers");
const Movie = require("../../models/movie");
const httpMocks = require("node-mocks-http");

const testMovie = require("../mock-data/movie-example.json");



describe("Reviews.calculateSum", () =>{

    it("Sprawdz czy calculateSum jest funkcja", () => {
        expect(typeof ReviewsController.calculateSum).toBe("function");
    })

    it("Sprawdz czy calculateAverage jest funkcja", () => {
        expect(typeof ReviewsController.calculateAverage).toBe("function");
    })

    it("Sprawdz czy calculateSum liczy poprawnie", () => {
        expect(ReviewsController.calculateSum(2, 5)).toBe(7);
    })

    it("Sprawdz czy calculateAvarage liczy poprawnie", () => { 
        expect(ReviewsController.calculateAverage(testMovie.reviews)).toEqual(3);
    })

    it("Sprwadz czy calculateAvarage posiada obsluge wyjatkow", () => {
        expect(() => {
            ReviewsController.calculateAvarage(testMovie.reviews);
        }).toThrow();
    });
});

