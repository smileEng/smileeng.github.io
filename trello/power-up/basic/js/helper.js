const helper = function ({key}) {

    const baseUrl = `https://api.trello.com/1/`;

    // function getToken(t){
    //     return  t.get('member', 'private', 'token');
    // }

    function getContext(t) {
        return t.getContext();
    }

    async function getCardName(t, {card}) {
        const url = `https://api.trello.com/1/cards/${card}/name?${await getAuthQS(t)}`;
        const {_value: name} = await $.get(url);
        return name;
    }

    async function updateCardName(t, {card, name}) {
        const url = `https://api.trello.com/1/cards/${card}?${await getAuthQS(t)}&name=${name}`;
        const result = await $.ajax({url, type: 'PUT'});
        return 1;
    }

    async function getAuthQS(t) {
        const token = await t.get('member', 'private', 'token');
        return `key=${key}&token=${token}`
    }


    return {
        getContext,
        card: {
            getName: getCardName,
            updateName: updateCardName
        }
    }
};