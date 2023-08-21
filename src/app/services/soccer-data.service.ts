import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoccerDataService {

  constructor(private httpClient: HttpClient) { }

  getSoccerMatchDay(roundId: any, competionId: any, matchDayIndex: any): Observable<any> {
    
    var urlMatchDay = `https://it.soccerway.com/a/block_competition_matches_summary?` +
      `block_id=page_competition_1_block_competition_matches_summary_9` +
      `&callback_params={"page":"1", "block_service_id":"competition_summary_block_competitionmatchessummary",` +
      `"round_id":"${roundId}", "outgroup":"", "view":"1", "competition_id":"${competionId}"}` +
      `&action=changePage&params={"page":${matchDayIndex}}`;

    var urlProxy = "/api/makeProxy";
    if(environment.production) {
      urlProxy = "http://localhost:3000/makeProxy";
    }
    var body = { "urlData": urlMatchDay };
    var httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' });
    return this.httpClient.post(urlProxy, body, { headers: httpHeaders });
  }

  getSoccerStanding(seasonId: any, roundId: any, competionId: any): Observable<any> {

    var urlStandings = `https://it.soccerway.com/a/block_competition_tables?` +
      `block_id=page_competition_1_block_competition_tables_11` +
      `&callback_params={"season_id":"${seasonId}", "round_id":"${roundId}", "outgroup":"", ` +
      `"competition_id":"${competionId}", "new_design_callback":"1"}` +
      `&action=changeTable&params={"type":"competition_wide_table"}`;

    var urlProxy = "/api/makeProxy";
    //var urlProxy = 'https://rivaserver.onrender.com/makeProxy'
    if(environment.production) {
      urlProxy = "http://localhost:3000/makeProxy";
    }
    var body = { "urlData": urlStandings };
    var httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' });
    return this.httpClient.post(urlProxy, body, { headers: httpHeaders });

  }

}
