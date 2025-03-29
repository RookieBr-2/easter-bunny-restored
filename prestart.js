sc.PARTY_OPTIONS.push("Lily");
sc.PARTY_OPTIONS.push("Rose");
ig.EVENT_STEP.SET_PARTY_MEMBER_LEVEL_VAR = ig.EventStepBase.extend({
  member: null,
  level: 0,
  exp: null,
  updateEquipment: false,
  _wm: new ig.Config({
    attributes: {
      member: {
        _type: "String",
        _info: "Party member to add",
        _select: sc.PARTY_OPTIONS
      },
      level: {
        _type: "NumberExpression",
        _info: "Level to set"
      },
      exp: {
        _type: "Integer",
        _info: "Exp to set"
      },
      updateEquipment: {
        _type: "Boolean",
        _info: "If true, also update equipment of party member"
      }
    }
  }),
  init: function (a) {
    this.member = a.member;
    this.level = a.level || 1;
    this.exp = a.exp || 0;
    this.updateEquipment = a.updateEquipment || false
  },
  start: function () {
    sc.party.getPartyMemberModel(this.member).setLevel(ig.Event.getExpressionValue(this.level), this.exp, this.updateEquipment, true)
  }
});
ig.ACTION_STEP.SHOW_SIDE_MSG = ig.ActionStepBase.extend({
  charExpression: null,
  message: null,
  hiCount: 0,
  _wm: new ig.Config({
      attributes: {
          person: {
              _type: "PersonExpression",
              _info: "Person + Exporession of message"
          },
          message: {
              _type: "LangLabel",
              _info: "Message to display",
              _large: true
          }
      },
      label: function () {
          return "<b>SHOW_SIDE_MSG</b> <em>" + wmPrint("PersonExpression", this.person) + "</em>: <i>" + wmPrint("LangLabel", this.message) + "</i>"
      }
  }),
  init: function (a) {
      this.charExpression = new sc.CharacterExpression(a.person.person, a.person.expression);
      this.message = new ig.LangLabel(a.message);
      ig.langEdit && ig.langEdit.submitMap("Side MSG " + this.charExpression.character.name, this.message);
      if (this.charExpression.character.name ==
          "main.lea" && a.message && a.message.en_US)
          this.hiCount = (this.hiCount = a.message.en_US.match(/hi[.!?]/gi)) ? this.hiCount.length : 0
  },
  clearCached: function () {
      this.charExpression.decreaseRef()
  },
  start: function () {
      this.hiCount && sc.stats.addMap("misc", "hiCount", this.hiCount || 0);
      ig.langEdit && ig.langEdit.submitRecent("Side MSG " + this.charExpression.character.name, this.message);
      sc.model.message.showSideMessage(this.charExpression, this.message)
  }
});