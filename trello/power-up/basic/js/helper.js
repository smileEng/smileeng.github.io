const helper = function ({key}) {

    const baseUrl = `https://api.trello.com/1/`;

    //decodeURIComponent( $.param( myObject ) );


    // function getToken(t){
    //     return  t.get('member', 'private', 'token');
    // }

    function getContext(t) {
        return t.getContext();
    }


    async function getMyBoards(t) {
        const url = `${baseUrl}members/me/boards?${await getAuthQS(t)}`;
        const results = await $.get(url);
        return results;
    }

    async function getBoardLists(t, {board}) {
        const url = `${baseUrl}boards/${board}/lists?${await getAuthQS(t)}`;
        const results = await $.get(url);
        return results;
    }

    async function getBoardLabels(t, {board}) {
        const url = `${baseUrl}boards/${board}/labels?${await getAuthQS(t)}`;
        const results = await $.get(url);
        return results;
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
        try {
            const url = `${baseUrl}cards/${card}/idMembers?${await getAuthQS(t)}&value=${member}`;
            const result = await $.ajax({url, type: 'POST'});
            return 1;
        } catch (e) {
            //if added will also throw error. LMFAO
            console.error(e)
            return 0;
        }
    }

    async function removeMemberToCard(t, {card, member}) {
        const url = `${baseUrl}cards/${card}/idMembers/${member}?${await getAuthQS(t)}`;
        const result = await $.ajax({url, type: 'DELETE'});
        return 1;
    }


    //2019-03-30T16:00:00.000Z

    async function getAuthQS(t) {
        const token = await t.get('member', 'private', 'token');
        return `key=${key}&token=${token}`
    }


    return {
        getContext,
        my: {
            getBoards: getMyBoards
        },
        board: {
            getMembers: getBoardMembers,
            getLists: getBoardLists,
            getLabels: getBoardLabels,
        },
        card: {
            getName: getCardName,
            updateName: updateCardName,
            addMember: addMemberToCard,
            removeMember: removeMemberToCard,
        }
    }
};

window.helper = helper;