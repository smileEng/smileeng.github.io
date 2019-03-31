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
        const url = `${baseUrl}members/me/boards?${await getAuthQS(t)}&filter=open%2Cstarred`;
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

    async function updateCardConfig(t, {
        card,
        ...configs
    }) {

        //dueComplete: false
        //due

        //For moving
        //idBoard
        //idList
        //&name=${name}&due=2019-03-29T14:30:00

        const queryStirng = decodeURIComponent($.param({...configs, ...await getAuthQSObject(t),}));
        const url = `${baseUrl}cards/${card}?${queryStirng}`;
        console.log("UDATE CARD Config URL: "+ queryStirng)
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
        try {
            const url = `${baseUrl}cards/${card}/idMembers/${member}?${await getAuthQS(t)}`;
            const result = await $.ajax({url, type: 'DELETE'});
            return 1;
        } catch (e) {
            console.error(e);
            return 0;
        }
    }


    async function addLabelToCard(t, {card, label}) {
        try {
            const url = `${baseUrl}cards/${card}/idLabels?${await getAuthQS(t)}&value=${label}`;
            const result = await $.ajax({url, type: 'POST'});
            return 1;
        } catch (e) {
            //if added will also throw error. LMFAO
            console.error(e)
            return 0;
        }
    }

    async function removeLabelToCard(t, {card, label}) {
        try {
            const url = `${baseUrl}cards/${card}/idLabels/${label}?${await getAuthQS(t)}`;
            const result = await $.ajax({url, type: 'DELETE'});
            return 1;
        } catch (e) {
            console.error(e)
            return 0;
        }
    }

    //2019-03-30T16:00:00.000Z
    async function getAuthQS(t) {
        const token = await t.get('member', 'private', 'token');
        return `key=${key}&token=${token}`
    }

    async function getAuthQSObject(t) {
        const token = await t.get('member', 'private', 'token');
        return {key, token};
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
            update: updateCardConfig,
            addMember: addMemberToCard,
            removeMember: removeMemberToCard,
            addLabel: addLabelToCard,
            removeLabel: removeLabelToCard,
        }
    }
};

window.helper = helper;