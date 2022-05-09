import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {CinemaService} from "../services/cinema.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public cities: any;//Type 'any' should be replaced of Model Type That represents cities.
  public cinemas: any;//Type 'any' should be replaced of Model Type That represents cinemas.
  public rooms: any;//Type 'any' should be replaced of Model Type That represents rooms.
  public currentCity: any;//This field created to mark each City clicked by the user as 'Active' + using condition on [ngClass] in 'cinema.component.html'.
  public currentCinema: any;//Same here..   //     ...      Cinema     ..     //
  public currentFilmSession: any;//Same here..   //     ... FilmSession  .. & to display each tickets of a specific FilmSession in a specific Room..     //
  public ticketsSelected: any[] =[];
  public submitted: any=false;//In order to hide the form input '<form [hidden]="submitted">...</form>' whenever
  // the user submit the form.
  //public isTicketsSelectedNotEmpty : boolean | undefined;
  public host = environment.backendHost;
  //Dependency Injection in Angular goes THROUGH Class's Constructor:
  constructor(private cinemaService:CinemaService) { }

  ngOnInit(): void {
    //let host = environment.backendHost;
    this.cinemaService.getCities()
      .subscribe(data=>{
        this.cities = data;
      },error => {
        console.log(error);
      })
  }

  onClickGetCinemasOfOneCity(c:any){//Type 'any' should be replaced of Model Type That represents City.
    this.currentCity = c;
    this.rooms=undefined;//In order to empty the list of Rooms of a Cinema's City Whenever a user ask for Another City on each Request.
    this.cinemaService.getCinemas(c)
      .subscribe(data=>{
        this.cinemas = data;
      },error => {
        console.log(error);
      })
  }

  onGetRoomsByOneCinema(cinema: any) {
    this.currentCinema=cinema;
    //this.currentFilmSession.tickets=[];//Added but not sure by myself.
    this.cinemaService.getRooms(cinema)
      .subscribe(data=>{
        this.rooms = data;
        this.rooms._embedded.rooms.forEach((room: any)=>{
          this.cinemaService.getProjectionsOfFilmInRoom(room)
            .subscribe(data=>{
              room.projectionOfFilmRooms=data;
            },error=>{
              console.log(error);
            })
        });
      },error => {
        console.log(error);
      })
  }

  onGetTicketsOfPlacesOfFilmSession(p: any) {
    this.currentFilmSession=p;
    this.submitted=false;
    console.log(p);
    this.cinemaService.getTicketsOfPlacesOfFilmSession(p)
      .subscribe((data:any)=>{
        //console.log(data);
        //console.log(this.currentFilmSession.tickets);
        //console.log(this.currentFilmSession);
        this.ticketsSelected=[];
        this.currentFilmSession.tickets=data;
        //this.currentFilmSession=data;
      },error=>{
        console.log(error);
        //return null;
      })
  }

  onGetSelectTicket(ticket: any) {
    //ticket.selected=!ticket.selected; //To switch boolean value of selected AND unselected Ticket(s) AND then apply to them a
    //this.ticketsSelected?.push(ticket); // proper Bootstrap Class inside the condition on the method 'getTicketBTNClass' down below:

  //By default at 1st we receive an unselected ticket(s):
    if (!ticket.selected){//(1) 1st Case of receiving 'unselected ticket' from user: when user select at 1st an unselected ticket,
      ticket.selected = true;// this method gets (2) executed, (3) THEN I should make the 'ticket.selected="true"'
      this.ticketsSelected?.push(ticket);// (4)THEN I should add it to the empty List(Array) of 'ticketsSelected'.
    }else{//(1) 2nd Case of receiving 'selected ticket' from user: when user select again same ticket that was already selected by him,
      ticket.selected=false;// this method gets (2) executed again, (3) THEN I should make the 'ticket.selected="false"'
      this.ticketsSelected?.splice(this.ticketsSelected?.indexOf(ticket),1);// (4)THEN I should remove it from the List(Array) of 'ticketsSelected'.
    }
    console.log(this.ticketsSelected);

  }

  //Applying a Bootstrap Class to Ticket's Button based on conditions.
  getTicketBTNClass(ticket: any) {
    //'btn btn-warning m-1 btn-sm' => current design for unselected buttons.
    let buttonClass = "btn";//button without color.
    if (ticket.reserved==true){
      buttonClass+=" btn-secondary m-1 btn-sm";
    }else if (ticket.selected){
      buttonClass+=" btn-success m-1 btn-sm";
    } else {
      buttonClass+=" btn-warning m-1 btn-sm";
    }
    return buttonClass;
  }


  onBuyTickets(formData:any) {
    let ticketsAddedByUser: any[] = [];
    this.submitted=true;//At this point this variable 'subm...' will be changed to true, so that Angular will hide form input for the user.
    this.ticketsSelected.forEach(ticket=>{
      ticketsAddedByUser.push(ticket.id);
    });
    formData.tickets = ticketsAddedByUser; //formData'.tickets' : '.tickets' is field that I created for "formData" parameter
    console.log(formData);// in order to save in it the list of new tickets selected by the user.
    this.cinemaService.buyTicketsService(formData)
      .subscribe((data:any)=>{
        alert("Ticket Reserved Successfully!")
      },(error:any)=>{
        console.log(error);
      });
  }
}
