import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GenericValidator } from 'src/app/shared/generic-validator';

import { IEditMemberData, IMemberResponse } from '../member';
import { MemberService } from '../member.service';

@Component({
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  @ViewChild('nameRef') nameRef: ElementRef;

  pageTitle = 'Member Edit';
  errorMessage: string;


  editForm: FormGroup;
  member: IEditMemberData;

  get isDirty(): boolean {
    return this.editForm.dirty ? true : false;
  }


  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      name: {
        required: 'Name is required.',
      },
      email: {
        required: 'Email is required.',
        email: 'Email is invalid.'
      },
      city: {
        required: 'City is required.'
      },

    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
    });

    this.route.data.subscribe(data => {
      const resolvedData: IMemberResponse = data['resolvedData'];
      this.errorMessage = resolvedData.errorMessage;
      this.onMovieRetrieved(resolvedData);
    });
  }
  onMovieRetrieved(member: IMemberResponse): void {
    if (member.isSuccess) {
      this.member = member.member;
      if (!this.member) {
        this.pageTitle = 'No member found';
      } else {
        if (+this.member._id === 0) {
          this.pageTitle = 'Add member';
        } else {
          this.pageTitle = `Edit member: ${this.member.name}`;
        }
      }

      // Update the data on the form
      this.editForm.patchValue({
        name: this.member.name,
        email: this.member.email,
        city: this.member.city,
      });
    }
    else{
      this.errorMessage = member.errorMessage;
    }

  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.nameRef.nativeElement.focus();
    }, 500);
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.editForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.editForm);
    });
  }

  reset(): void {
    this.editForm.reset();
  }

  saveMember(): void {
    if (this.editForm.valid) {
      if (this.editForm.dirty) {
        const member = { ...this.member, ...this.editForm.value };

        if (+member._id === 0) {
          this.memberService.createMember(member).subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
        } else {
          this.memberService.updateMember(member).subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
        }
      } else {
        this.errorMessage = 'Please correct the validation errors.';
      }
    }
  }

  onSaveComplete(): void {
    this.reset();
    this.router.navigate(['/members']);
  }
}
