import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Users } from "../model/users.model";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class usersService{

    private url: string = 'http://localhost:8081/users';

  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<Users[]> {
    return this.httpClient.get<Users[]>(this.url);
  }

  getUserById(userId: number): Observable<Users> {
    return this.httpClient.get<Users>(`${this.url}/${userId}`);
  }

  createUser(user: Users): Observable<Users> {
    return this.httpClient.post<Users>(this.url, user);
  }

  updateUserById(userId: number, updatedUser: Users): Observable<Users> {
    return this.httpClient.put<Users>(`${this.url}/${userId}`, updatedUser);
  }

  deleteUserById(userId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${userId}`);
  }
}