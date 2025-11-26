import Handlebars from 'handlebars'

Handlebars.registerHelper("range", function(num) {
    return [...Array(num)].keys()
});