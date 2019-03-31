/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;

const HELPER = window.helper({key: "9ed85a487eb0b08bff2f11e84cc80c16"});

var GLITCH_ICON = './images/glitch.svg';
var WHITE_ICON = './images/icon-white.svg';
var GRAY_ICON = './images/icon-gray.svg';

var boardButtonCallback = function (t) {
    return t.popup({
        title: 'Popup List Example',
        items: [
            {
                text: 'Open Modal',
                callback: function (t) {
                    return t.modal({
                        url: './modal.html', // The URL to load for the iframe
                        args: {text: 'Hello'}, // Optional args to access later with t.arg('text') on './modal.html'
                        accentColor: '#F2D600', // Optional color for the modal header
                        height: 500, // Initial height for iframe; not used if fullscreen is true
                        fullscreen: true, // Whether the modal should stretch to take up the whole screen
                        callback: () => console.log('Goodbye.'), // optional function called if user closes modal (via `X` or escape)
                        title: 'Hello, Modal!', // Optional title for modal header
                        // You can add up to 3 action buttons on the modal header - max 1 on the right side.
                        actions: [{
                            icon: GRAY_ICON,
                            url: 'https://google.com', // Opens the URL passed to it.
                            alt: 'Leftmost',
                            position: 'left',
                        }, {
                            icon: GRAY_ICON,
                            callback: (tr) => tr.popup({ // Callback to be called when user clicks the action button.
                                title: 'Settings',
                                url: 'settings.html',
                                height: 164,
                            }),
                            alt: 'Second from left',
                            position: 'left',
                        }, {
                            icon: GRAY_ICON,
                            callback: () => console.log('🏎'),
                            alt: 'Right side',
                            position: 'right',
                        }],
                    })
                }
            },
            {
                text: 'Open Board Bar',
                callback: function (t) {
                    return t.boardBar({
                        url: './board-bar.html',
                        height: 200
                    })
                        .then(function () {
                            return t.closePopup();
                        });
                }
            }
        ]
    });
};

const trelloBoardDetailsPrintout = async function (t) {

    const boards = await HELPER.my.getBoards(t);
    const {board, card} = await HELPER.getContext(t)

    const results = await t.getAll();

    console.log("Boards:", boards)
    const boardsIWant = boards.filter(function (d) {
        return d.id == board;
    })

    for (const index in boardsIWant) {
        const board = boardsIWant[index];
        const {id} = board;
        const lists = await HELPER.board.getLists(t, {board: id});
        const labels = await HELPER.board.getLabels(t, {board: id});
        const members = await HELPER.board.getMembers(t, {board: id});
        console.log("Booard", board,
            "members: ", members,
            "List: ", lists,
            "Labels: ", labels);
    }


    console.log("let the magic beginds");

    const cardName = await HELPER.card.getName(t, {card});
    const members = await HELPER.board.getMembers(t, {board});
    const newCardName = cardName + " 1";
    await HELPER.card.updateName(t, {card, name: newCardName});
    await HELPER.card.addMember(t, {card, member: "54a94d03ad9dfede1a13f59f"});
    await HELPER.card.removeMember(t, {card, member: "534a0cf75530fa95323f352c"});

    await HELPER.card.addLabel(t, {card, label: "54a94d03ad9dfede1a13f59f"});
    await HELPER.card.removeLabel(t, {card, label: "534a0cf75530fa95323f352c"});


    console.log("MAGIC COMPLETED!");
    console.log("Members: ", members);

    return;

    // In this case we want to attach that park to the card as an attachment
    // but first let's ensure that the user can write on this model
    if (t.memberCanWriteToModel('card')) {
        return t.attach({url: urlForCode, name: nameForCode})
            .then(function () {
                // once that has completed we should tidy up and close the popup
                return t.closePopup();
            });
    } else {
        console.log("Oh no! You don't have permission to add attachments to this card.")
        return t.closePopup(); // We're just going to close the popup for now.
    }


}

const updateCardStatus = async function (t, {
    lbld: labelDelete = [],
    lbla: labelAdd = [],
    lbl: labels = [],
    lstu: listMove = '',
    brdu: boardMove = '',
    archive: isArchive = false,
    dateRelative: dueDateRelativeMinutes = 0,
}) {

    const {board, card} = await HELPER.getContext(t)
    const cardName = await HELPER.card.getName(t, {card});
    const members = await HELPER.board.getMembers(t, {board});

    let cardConfig = {};

    if (listMove)
        cardConfig["idList"] = listMove;
    if (boardMove)
        cardConfig["idBoard"] = boardMove;
    if (dueDateRelativeMinutes && dueDateRelativeMinutes !== 0)
        cardConfig["due"] = moment().add("minutes", dueDateRelativeMinutes).toISOString();
    if (labels.length > 0)
        cardConfig["idLabels"] = labels.join();
    if (isArchive)
        cardConfig["closed"] = true

    if (Object.keys(cardConfig).length > 0) {
        await HELPER.card.update(t, {card, ...cardConfig});
    }
}


// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
    // NOTE about asynchronous responses
    // If you need to make an asynchronous request or action before you can reply to Trello
    // you can return a Promise (bluebird promises are included at TrelloPowerUp.Promise)
    // The Promise should resolve to the object type that is expected to be returned
    'attachment-sections': function (t, options) {
        // options.entries is a list of the attachments for this card
        // you can look through them and 'claim' any that you want to
        // include in your section.

        // we will just claim urls for Yellowstone
        var claimed = options.entries.filter(function (attachment) {
            return attachment.url.indexOf('http://www.nps.gov/yell/') === 0;
        });

        // you can have more than one attachment section on a card
        // you can group items together into one section, have a section
        // per attachment, or anything in between.
        if (claimed && claimed.length > 0) {
            // if the title for your section requires a network call or other
            // potentially length operation you can provide a function for the title
            // that returns the section title. If you do so, provide a unique id for
            // your section
            return [{
                id: 'Yellowstone', // optional if you aren't using a function for the title
                claimed: claimed,
                icon: GLITCH_ICON,
                title: 'Example Attachment Section: Yellowstone',
                content: {
                    type: 'iframe',
                    url: t.signUrl('./section.html', {arg: 'you can pass your section args here'}),
                    height: 230
                }
            }];
        } else {
            return [];
        }
    },

    'board-buttons': function (t, options) {
        return [{
            // we can either provide a button that has a callback function
            // that callback function should probably open a popup, overlay, or boardBar
            icon: WHITE_ICON,
            text: 'Popup',
            callback: boardButtonCallback
        }, {
            // or we can also have a button that is just a simple url
            // clicking it will open a new tab at the provided url
            icon: WHITE_ICON,
            text: 'URL',
            url: 'https://trello.com/inspiration',
            target: 'Inspiring Boards' // optional target for above url
        }];
    },
    'card-badges': function (t, options) {
        return getBadges(t);
    },
    'card-buttons': async function (t, options) {
        // return new Promise(async function (resolve) {
        try {
            return t
                .get('board', 'private', 'jsonUrl')
                .then(function (jsonUrl) {
                    const cardButtonsJsonPath = `${jsonUrl}/card-buttons.json`;
                    return $.get(cardButtonsJsonPath);
                })
                .then(function (cardButtonConfig) {
                    return cardButtonConfig["card-buttons"]
                        .map(function ({icon, text, ...parameters}) {
                            return {
                                icon,
                                text,
                                callback: function (t) {
                                    return updateCardStatus(t, parameters)
                                }
                            };
                        })
                });
        } catch (e) {
            console.error("An error has occured while trying to load json");
            return [];
        }
        // });
    },


    'format-url': function (t, options) {
        // options.url has the url that we are being asked to format
        // in our response we can include an icon as well as the replacement text

        return {
            icon: GRAY_ICON, // don't use a colored icon here
            text: '👉 ' + options.url + ' 👈'
        };

        // if we don't actually have any valuable information about the url
        // we can let Trello know like so:
        // throw t.NotHandled();
    },

    'show-settings': function (t, options) {
        // when a user clicks the gear icon by your Power-Up in the Power-Ups menu
        // what should Trello show. We highly recommend the popup in this case as
        // it is the least disruptive, and fits in well with the rest of Trello's UX
        return t.popup({
            title: 'Settings',
            url: './settings.html',
            height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
        });
    },
    /*
    /*

        🔑 Authorization Capabiltiies 🗝

        The following two capabilities should be used together to determine:
        1. whether a user is appropriately authorized
        2. what to do when a user isn't completely authorized

    */
    'authorization-status': function (t, options) {
        // Return a promise that resolves to an object with a boolean property 'authorized' of true or false
        // The boolean value determines whether your Power-Up considers the user to be authorized or not.

        // When the value is false, Trello will show the user an "Authorize Account" options when
        // they click on the Power-Up's gear icon in the settings. The 'show-authorization' capability
        // below determines what should happen when the user clicks "Authorize Account"

        // For instance, if your Power-Up requires a token to be set for the member you could do the following:
        return t.get('member', 'private', 'token')
            .then(function (token) {
                if (token) {
                    return {authorized: true};
                }
                return {authorized: false};
            });
        // You can also return the object synchronously if you know the answer synchronously.
    },
    'show-authorization': function (t, options) {
        // Returns what to do when a user clicks the 'Authorize Account' link from the Power-Up gear icon
        // which shows when 'authorization-status' returns { authorized: false }.

        // If we want to ask the user to authorize our Power-Up to make full use of the Trello API
        // you'll need to add your API from trello.com/app-key below:
        let trelloAPIKey = '9ed85a487eb0b08bff2f11e84cc80c16';
        // This key will be used to generate a token that you can pass along with the API key to Trello's
        // RESTful API. Using the key/token pair, you can make requests on behalf of the authorized user.

        // In this case we'll open a popup to kick off the authorization flow.
        if (trelloAPIKey) {
            return t.popup({
                title: 'My Auth Popup',
                args: {apiKey: trelloAPIKey}, // Pass in API key to the iframe
                url: './authorize.html', // Check out public/authorize.html to see how to ask a user to auth
                height: 140,
            });
        } else {
            console.log("🙈 Looks like you need to add your API key to the project!");
        }
    }
}, {
    appKey: '9ed85a487eb0b08bff2f11e84cc80c16',
    appName: 'My own power up'
});

console.log('Loaded by: ' + document.referrer);


var a = {
    board: "5c9d4ead1daa0b631c75743e",
    card: "5c9d52075e297845f60a3a69",
    command: "callback",
    el: "dnezcVwVUdnKzP1s",
    member: "534a0cf75530fa95323f352c",
    organization: "57bfc6c1bdb36fdccf5c3476",
    permissions: {
        board: "write",
        card: "write",
        organization: "write",
    },
    version: "build-2906",
}


// Promise
//     .all([
//         t.getContext(),
//         t.get('member', 'private', 'token')
//     ])
//     .then(function ([context, token]) {
//         const {card} = context;
//         getCards({card, token})
//     });
//
// function getCards({card, token}) {
//
//     const url = `https://api.trello.com/1/cards/${card}/name?key=9ed85a487eb0b08bff2f11e84cc80c16&token=${token}`;
//     $.get(url)
//         .then(function ({_value: name}) {
//             updateCards({card, name, token})
//         })
//         .catch(function (e) {
//             console.log("Error during getting card", e);
//         })
// }
//
// function updateCards({card, name, token}) {
//     const url = `https://api.trello.com/1/cards/${card}?key=9ed85a487eb0b08bff2f11e84cc80c16&token=${token}&name=${name + 1}`;
//     $.ajax({url, type: 'PUT'})
//         .then(function () {
//             console.log("updatedCard");
//         })
//         .catch(function (e) {
//             console.log("Error during update card", e);
//         })
// }


// t.getRestApi().getToken()
//     .then(function (token) {
//         if (!token) {
//             console.log("YOURE NOT AUTH")
//         } else {
//             console.log("Getting list of members")
//             const url = `https://api.trello.com/1/members/me/boards?` +
//                 `key=9ed85a487eb0b08bff2f11e84cc80c16&token=${token}`
//             $.get(url);
//         }
//     });
//
// t.get('member', 'private', 'token')
//     .then(function (token) {
//         if (!token) {
//             console.log("YOURE NOT AUTH")
//         } else {
//             console.log("Getting list of members")
//             const url = `https://api.trello.com/1/members/me/boards?` +
//                 `key=9ed85a487eb0b08bff2f11e84cc80c16&token=${token}`
//             $.get(url);
//         }
//     });


// t.card('all')
//     .then(function (card) {
//         console.log(JSON.stringify(card, null, 2));
//     })
//console.log("CardButtonUpdateTitle:", t);