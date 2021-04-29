const helper = function ({key}) {

    const baseUrl = `https://api.trello.com/1/`;

    //decodeURIComponent( $.param( myObject ) );


    // function getToken(t){
    //     return  t.get('member', 'private', 'token');
    // }

    function getContext(t) {
        return t.getContext();
    }


    //TODO: getMyCardLists(t, {list})
    //

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


    async function getListCards(t, {idList}) {
        const url = `${baseUrl}lists/${idList}/cards?${await getAuthQS(t)}`;
        const results = await $.get(url);
        return results;
    }

    async function getCardName(t, {card}) {
        const url = `${baseUrl}cards/${card}/name?${await getAuthQS(t)}`;
        const {_value: name} = await $.get(url);
        return name;
    }

    async function cloneCard(t, {
        ...configs
    }) {
        try {


            //keepFromSource: attachments,checklists,comments,due,labels,members,stickers or all
            const queryStirng = decodeURIComponent($.param({...configs, ...await getAuthQSObject(t),}));
            const url = `${baseUrl}cards?${queryStirng}`;
            const result = await $.ajax({url, type: 'POST'});
            return 1;

            // const url = `${baseUrl}cards?${await getAuthQS(t)}`;
            // const result = await $.ajax({
            //     url,
            //     type: 'POST',
            //     contentType: 'application/json',
            //     data
            // });
            // return 1;
        } catch (e) {
            //if added will also throw error. LMFAO
            console.error(e)
            return 0;
        }

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
        // const queryStirng = decodeURIComponent($.param({...configs, ...await getAuthQSObject(t),}));

        //Just to ensure the name dont have funny character
        let encodeConfig = {...configs};
        if (encodeConfig.name)
            encodeConfig.name = encodeURIComponent(encodeConfig.name);

        const queryString = decodeURIComponent($.param({...encodeConfig, ...await getAuthQSObject(t),}));
        const url = `${baseUrl}cards/${card}?${queryString}`;

        try {
            console.log("UPDATE CARD Config URL: " + queryString)
            const result = await $.ajax({url, type: 'PUT'});
            return 1;
        } catch (e) {
            console.error("Failed to UPDATE CARD Config URL: " + queryString, e)
            return 0;
        }
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

    async function removeAllMembersFromCard(t, {card}) {
        try {

            const authQS = await getAuthQS(t);
            const memberUrls = `${baseUrl}cards/${card}/idMembers?${authQS}`;
            const members = await $.get(memberUrls);
            for (let index in members) {
                const member = members[index].id;
                const url = `${baseUrl}cards/${card}/idMembers/${member}?${authQS}`;
                const result = await $.ajax({url, type: 'DELETE'});
            }

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
        list: {
            getCards: getListCards
        },
        card: {
            getName: getCardName,
            update: updateCardConfig,
            clone: cloneCard,
            addMember: addMemberToCard,
            removeMember: removeMemberToCard,
            removeAllMembers: removeAllMembersFromCard,
            addLabel: addLabelToCard,
            removeLabel: removeLabelToCard,
        }
    }
};

window.helper = helper;
