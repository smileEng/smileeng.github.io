/* global TrelloPowerUp */

const Promise = TrelloPowerUp.Promise;
const t = TrelloPowerUp.iframe();

const jsonUrlInputText = document.getElementById('jsonUrl');
// var vegetableSelector = document.getElementById('vegetable');

t.render(function () {
    //https://smileeng.github.io/trello/power-up/basic/configs/board/trello-powerups/card-buttons.json


    return Promise.all(
        [
            t.get('board', 'private', 'jsonUrl')
        ])
        .spread(function (jsonUrl) {
            jsonUrlInputText.value = jsonUrl;
        })
        .then(function () {
            t.sizeTo('#content')
                .done();
        })
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