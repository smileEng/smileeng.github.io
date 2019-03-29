const helper = function ({key}) {

    const baseUrl = `https://api.trello.com/1/`;

    //decodeURIComponent( $.param( myObject ) );


    // function getToken(t){
    //     return  t.get('member', 'private', 'token');
    // }

    function getContext(t) {
        return t.getContext();
    }

    async function getBoardMembers(t, {board}) {
        const url = `${baseUrl}boards/${board}/members?${await getAuthQS(t)}`;
        const results = await $.get(url);
        return results;
    }


    async function getCardName(t, {card}) {
        const url = `${baseUrl}cards/${card}/name?${await getAuthQS(t)}`;
        const {_value: name} = await $.get(url);
        return name;
    }

    async function updateCardName(t, {card, name}) {

        //dueComplete: false
        const url = `${baseUrl}cards/${card}?${await getAuthQS(t)}&name=${name}&due=2019-03-29T14:30:00`;
        const result = await $.ajax({url, type: 'PUT'});
        return 1;
    }

    async function addMemberToCard(t, {card, member}) {
        const url = `${baseUrl}cards/${card}/idMembers?${await getAuthQS(t)}&value=${member}`;
        const result = await $.ajax({url, type: 'POST'});
        return 1;
    }


    //2019-03-30T16:00:00.000Z

    async function getAuthQS(t) {
        const token = await t.get('member', 'private', 'token');
        return `key=${key}&token=${token}`
    }


    return {
        getContext,
        board: {
            getMembers: getBoardMembers
        },
        card: {
            getName: getCardName,
            updateName: updateCardName
        }
    }
};

window.helper = helper;