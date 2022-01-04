const Category = require('../models/category');

module.exports = {
    listCategories: function(req, res) { // function to call category model
        Category.listCategories(function(err, result) {
            if(err) {
                console.log(err);
                return res.status(500).send({
                    msg: "Error in fetching categories !!",
                    success: false,
                });
            }
            return res.status(200).send({
                msg: "Successfully fetched catgeories", 
                categories: result, 
                success: true,
            });
        })
    }
}
