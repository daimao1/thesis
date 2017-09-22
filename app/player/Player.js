/**
 * Created by Damian Kozieł on 15.09.2017.
 */

class Player{
  constructor(playerName, fieldNumber, positionX, positionY){
    this.playerName = playerName;
    this.fieldNumber = fieldNumber;
    this.positionX = positionX;
    this.positionY = positionY;
  }

  setName(playerName){
    this.playerName = playerName;
  }

  getName(){
    return this.playerName;
  }

  setFieldNumber(fieldNumer){
    this.fieldNumber = fieldNumer;
  }

  getFieldNumber(){
    return this.fieldNumber;
  }

  setPositionX(positionX){
    this.positionX = positionX;
  }

  getPositionX(){
    return this.positionX;
  }

  setPositionY(positionY){
    this.positionY = positionY;
  }

  getPositionY(){
    return this.positionY;
  }

}
module.exports = Player;