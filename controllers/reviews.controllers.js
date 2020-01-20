

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }else{
        var sum = 0;
        try{
            reviews.forEach(element => {
                sum = calculateSum(sum, element.rating)
            });
            return sum / reviews.length;
        }catch(err){
            throw (err);
        }
    }
}
    

function calculateSum(a, b) { 
   return a + b
}

module.exports = {
    calculateSum,
    calculateAverage
}
