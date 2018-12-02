import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  minDate: Date;
  maxDate: Date;

  constructor(private authService: AuthService, private alertify: AlertifyService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 365 * 100)
    this.maxDate.setDate(this.maxDate.getDate() - 365 * 18)

    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'YYYY-MM-DD',
      minDate: this.minDate,
      maxDate: this.maxDate,
      showWeekNumbers: false
    };
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(input: FormGroup) {
    return input.get('password').value === input.get('confirmPassword').value ? null : { 'mismatch': true };
  }

  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(() => {
        this.alertify.success('registration successful');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
