import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Users } from '../model/users.model';
import { usersService } from '../service/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  
  users!: FormGroup;
  userSubmitted = false;
  userList: Users[] = [];

  constructor(private formBuilder: FormBuilder, private usersService: usersService) {}

  ngOnInit(): void {
    this.users = this.formBuilder.group({
      userId: [''],
      userName: ['', Validators.required],
      userCountry: ['', Validators.required],
      productModel: this.formBuilder.array([]) // ✅ Use correct name "productModel"
    });
    this.getUsers();
  }
  
  get productModel(): FormArray {
    return this.users.get('productModel') as FormArray;
  }
  
  addProduct(): void {
    this.productModel.push(
      this.formBuilder.group({
        proId: [''],
        proName: ['', Validators.required]
      })
    );
  }
  
  removeProduct(index: number): void {
    this.productModel.removeAt(index);
  }

  getUsers(): void {
    this.usersService.getUsers().subscribe(
      (response: any[]) => { // Using `any[]` to avoid TypeScript errors
        console.log("Fetched Users:", response);
        //Ensure productModel is mapped to product correctly
        this.userList = response.map(user => ({
          ...user,
          product: user.productModel ?? [] // Use `??` to assign an empty array if undefined
        }));
      },
      (error) => {
        console.error("Failed to fetch users", error);
      }
    );
  }
  
  // Populate form with user details for editing
  populateUsers(user: Users): void {
    this.users.patchValue({
      userId: user.userId,
      userName: user.userName,
      userCountry: user.userCountry
    });

    // Populate product list
    this.productModel.clear();
    user.product.forEach(prod => {
      this.productModel.push(
        this.formBuilder.group({
          proId: [prod.proId],
          proName: [prod.proName, Validators.required]
        })
      );
    });
  }



  onSubmit(): void {
    this.userSubmitted = true;
  
    if (this.users.valid) {
      const userData: Users = this.users.value;
  
      console.log("Submitting User Data:", userData); // ✅ Debugging Step
  
      this.usersService.createUser(userData).subscribe(
        response => {
          console.log("User Created", response);
          this.userList.push(response);
          this.users.reset();
          this.productModel.clear(); // ✅ Ensure old products are removed from form
        },
        error => {
          console.error("Failed to create user", error);
        }
      );
    }
  }

  // Delete user by ID
  deleteUser(userId: number): void {
    if (!userId) {
      console.error("Invalid userId");
      return;
    }

    this.usersService.deleteUserById(userId).subscribe(
      response => {
        console.log("User deleted", response);
        this.userList = this.userList.filter(user => user.userId !== userId);
      },
      error => {
        console.error("Failed to delete user", error);
      }
    );
  }
}






