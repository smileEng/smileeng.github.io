/* global TrelloPowerUp */

const HELPER = window.helper({key: "9ed85a487eb0b08bff2f11e84cc80c16"});
const Promise = TrelloPowerUp.Promise;
const t = TrelloPowerUp.iframe();


const jsonUrlInputText = document.getElementById('jsonUrl');
const boardNameInputText = document.getElementById('boardName');

t.render(function () {
    return Promise.all(
        [
            t.get('board', 'private', 'jsonUrl')
        ])
        .spread(function (jsonUrl) {
            jsonUrlInputText.value = jsonUrl;
        })
        .then(function () {
            t.sizeTo('#content').done();
        })
});

document.getElementById('save')
    .addEventListener('click', function () {
        return t
            .set('board', 'private', 'jsonUrl', jsonUrlInputText.value)
            .then(function () {
                t.closePopup();
            })
    })


document.getElementById('showSettings')
    .addEventListener('click', async function () {

        const boards = await HELPER.my.getBoards(t);
        console.log("Boards:", boards)

        const {board} = await HELPER.getContext(t)
        const filterByBoardId = boardNameInputText.text || board;
        const filteredBoards = boards.filter((d) => d.id == filterByBoardId);
        for (const index in filteredBoards) {
            const board = filteredBoards[index];
            const {id} = board;
            const lists = await HELPER.board.getLists(t, {board: id});
            const labels = await HELPER.board.getLabels(t, {board: id});
            const members = await HELPER.board.getMembers(t, {board: id});
            console.log(
                "Board", board,
                "members: ", members,
                "List: ", lists,
                "Labels: ", labels);
        }
        console.log("Completed print trace.")

        return;
    })

