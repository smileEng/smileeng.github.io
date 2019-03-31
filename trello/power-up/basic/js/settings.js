/* global TrelloPowerUp */

const Promise = TrelloPowerUp.Promise;
const t = TrelloPowerUp.iframe();

const jsonUrlInputText = document.getElementById('jsonUrl');
// var vegetableSelector = document.getElementById('vegetable');

t.render(function () {
    t.sizeTo('#content').done();

    // return Promise.all([
    //     t.get('board', 'shared', 'fruit'),
    //     t.get('board', 'private', 'vegetable')
    // ])
    //     .spread(function (savedFruit, savedVegetable) {
    //         if (savedFruit && /[a-z]+/.test(savedFruit)) {
    //             fruitSelector.value = savedFruit;
    //         }
    //         if (savedVegetable && /[a-z]+/.test(savedVegetable)) {
    //             vegetableSelector.value = savedVegetable;
    //         }
    //     })
    //     .then(function () {
    //         t.sizeTo('#content')
    //             .done();
    //     })
});

document
    .getElementById('save')
    .addEventListener('click', function () {
        return t
            .set('board', 'private', 'jsonUrl', jsonUrlInputText.value)
            .then(function () {
                t.closePopup();
            })
    })

// .then(function () {
//     return t.set('board', 'shared', 'fruit', fruitSelector.value);
// })