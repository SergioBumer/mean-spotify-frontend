import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { StorageProvider } from './services/storageProvider';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserService, StorageProvider],
})
export class AppComponent implements OnInit {
  title = 'Mancotify';

  public user: User;
  public user_to_register: User;
  public identity: any = false;
  public token: any = '';
  public url: String;
  errorMessage: string = '';
  messageRegister: string = '';
  constructor(
    private userService: UserService,
    private storageProvider: StorageProvider
  ) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_to_register = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
  }
  ngOnInit(): void {
    this.identity = this.storageProvider.getIdentity();
    this.token = this.storageProvider.getToken();
  }

  onSubmit() {
    const text = this.userService
      .signUp(this.user, false)
      .then((response: any) => {
        let identity = response;
        console.log(identity);

        this.identity = identity;

        if (!this.identity._id) {
          alert('El usuario no esta correctamente identificado.');
        } else {
          // Crear elemento en el localStorage
          const token = this.userService
            .signUp(this.user, true)
            .then((response: any) => {
              let token = response.token;
              this.token = token;

              if (this.token.length <= 0) {
                alert('El token no se generó correctamente');
              } else {
                // Crear elemento en el localStorage
                localStorage.setItem('identity', JSON.stringify(this.identity));
                localStorage.setItem('token', token);
                // @ts-ignore: Object is possibly 'null'.
                document.getElementById('identity_name').innerHTML = this.identity.name; 
                const imagePath = `${this.url}/getImage/${this.identity.image}`;
                // @ts-ignore: Object is possibly 'null'.
                document.getElementById('user-image')?.setAttribute('src', imagePath);
                this.messageRegister = '';
                this.errorMessage = '';
              }
            })
            .catch((e) => {
              console.log('Me rompo aqui');

              this.errorMessage = e.error.message;
            });
        }
      })
      .catch((err) => {
        console.log(err);

        this.errorMessage = err.error.message;
      });
  }

  register() {
    console.log(this.user_to_register);
    this.userService
      .register(this.user_to_register)
      .then((response: any) => {
        console.log(response.user);
        this.messageRegister = 'Registro exitoso.'
        this.user_to_register = new User('', '', '', '', '', 'ROLE_USER', '');
        
      })
      .catch((err) => {
        console.log(err);
        
      });
  }

  logOut() {
    this.storageProvider.deleteSessionStorage();
    this.identity = null;
    this.token = null;
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
  }
}
