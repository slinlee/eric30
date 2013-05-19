// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.player.achieved = function () {
    if (this.score >= this.requiredPts) {

      return "animated wiggle";
    }
  }

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 1}});
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });

  Template.addChallenge.events ({
    'submit form' : function (e) {
      e.preventDefault();
      Players.insert({name: $('#newchallenge').val(), score: 0});
    }
  })
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    // Players.remove({});//debug
    if (Players.find().count() === 0) {
      var names = ["Give Zona a Kiss!",
                   "Take a shot!",
                   "Sing a Song",
                   "Give Zona a sloppy kiss!",
                   "Get on the indoboard!"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: 0, requiredPts: 10});
    }
  });
}
