import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailMatcherValidator } from '../shared/email-matcher/email-matcher.component';
import { VerifierCaracteresValidator } from '../shared/longueur-minimum/longueur-minimum.component';
import { ITypeProbleme } from './typeprobleme';
import { TypeproblemeService } from './typeprobleme.service';
 

@Component({
  selector: 'inter-probleme',
  templateUrl: './probleme.component.html',
  styleUrls: ['./probleme.component.css']
})
export class ProblemeComponent implements OnInit {
  problemeForm: FormGroup;
  typesProbleme: ITypeProbleme[];
  errorMessage: string;
  constructor(private fb: FormBuilder, private typeproblemeService: TypeproblemeService) { }

  ngOnInit(){
    this.problemeForm = this.fb.group({
      prenom: ['' , [VerifierCaracteresValidator.longueurMinimum(3), Validators.required]],
      nom: ['', [Validators.required, Validators.maxLength(50)]],
      noTypeProb:['',[Validators.required]],
      courrielGroup: this.fb.group({
        courriel: [{value: '', disabled: true,}],
        courrielConfirmation: [{value: '', disabled: true}],
      }),
    telephone: [{value: '', disabled: true}], 
    notification:['pasnotification'],
    descriptionProbleme:['', [Validators.required, Validators.minLength(5)]],
    noUnite:'',
    dateProbleme:{value: Date(), disabled: true}
    });

    this.typeproblemeService.obtenirTypesProbleme()
    .subscribe(typesProbleme => this.typesProbleme = typesProbleme,
               error => this.errorMessage = <any>error);  
      this.problemeForm.get('notification').valueChanges
      .subscribe(value => this.appliquerNotifications(value));

  }
  save(): void {
  }

  appliquerNotifications(typesNotifications: string): void {                              //courriel / courriel confirmation / telephone
    const courrielControl = this.problemeForm.get('courrielGroup.courriel');         
    const courrielConfirmationControl = this.problemeForm.get('courrielGroup.courrielConfirmation');   
    const courrielGroupControl = this.problemeForm.get('courrielGroup');   
    const telephone = this.problemeForm.get('telephone')


    // Tous remettre à zéro
    courrielControl.clearValidators();
    courrielControl.reset();  // Pour enlever les messages d'erreur si le controle contenait des données invaldides
    courrielControl.disable();  

    courrielConfirmationControl.clearValidators();
    courrielConfirmationControl.reset();    
    courrielConfirmationControl.disable();

    telephone.clearValidators();
    telephone.reset();    
    telephone.disable();
    
    if (typesNotifications=='parCourriel') {   
      courrielControl.setValidators([Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]);      
      courrielControl.enable();  
      courrielConfirmationControl.setValidators([Validators.required] );              
      courrielConfirmationControl.enable();
      courrielGroupControl.setValidators([Validators.compose([emailMatcherValidator.courrielDifferents()])]);                      
    }   
    else
    {
      if(typesNotifications=='messagerieTexte')
      {
        telephone.setValidators([Validators.required,Validators.pattern('[0-9]+'),Validators.minLength(10),Validators.maxLength(10)]);      
        telephone.enable();         
      }
    }
    courrielControl.updateValueAndValidity();   
    courrielConfirmationControl.updateValueAndValidity();
    telephone.updateValueAndValidity();             
    }

    





}
