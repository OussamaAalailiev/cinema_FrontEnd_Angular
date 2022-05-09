import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
//Every Interaction with the Backend part will be THROUGH this 'CinemaService' Service Component:
export class CinemaService {

  public host:string = "http://localhost:8082"; //this is the Backend Host Ip Address.

  constructor(private http: HttpClient) { }
  //Getting Cities In Json Cinema Object's Response From Backend App:
  //To request the URL 'http://localhost:8082/cities'.
  public getCities(){
    return this.http.get(this.host+"/cities");
  }
  //'c._links.cinemas.href': each Json 'City' Object has a link to its 'cinemas' via the 'Url' down below via Spring Hateoas Rest API's links from Backend part of the other App:
  //Type 'any' should be replaced of Model Type That represents City.
  //Getting Cinemas by each City In Json City Object's Response From Backend App:
  getCinemas(c:any) {
    return this.http.get(c._links.cinemas.href);
    //'this.http.get(...)' Link matches > 'http://localhost:8082/cities/id{ex:1}/cinemas'.
    // It gets a List of Cinemas for each City.
  }
  //Getting Rooms by each Cinema In Json Cinema Object's Response From Backend App:
  getRooms(cinema: any) {
    // console.log(cinema._links.rooms.href);
    return this.http.get(cinema._links.rooms.href);
  }
  //From this URL 'http://localhost:8082/rooms/id'
  // we request the URL 'http://localhost:8082/rooms/id/projectionOfFilmRooms?projection=projection1'.
  getProjectionsOfFilmInRoom(room: any) {
    let url = room._links.projectionOfFilmRooms.href.replace("{?projection}","");//We needed to remove '{}' so that the url will work properly.
    return this.http.get(url+"?projection=projection1");
  }
  //From this URL 'http://localhost:8082/projectionOfFilmRooms/id'
  // we request the URL 'http://localhost:8082/projectionOfFilmRooms/id/tickets?projection=TicketsProjection' via Spring Hateoas Rest API's Links Hierarchy.
  getTicketsOfPlacesOfFilmSession(p: any) {
    let url = p._links.tickets.href.replace("{?projection}","");//We needed to remove '{}' so that the url will work properly.
    return this.http.get(url+"?projection=TicketsProjection");
  }

  buyTicketsService(formData: any) {
    return this.http.post(this.host+"/payTickets",formData );//'formData' will be sent in the body of the Post Request.
  }
}
