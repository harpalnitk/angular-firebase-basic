import { FormArray, FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Developer, Team } from './team.model';


interface TeamFormValue{
  teamName: string;
  members:{
    origData: Developer;
    favColor: string;
    expertiseLevel: string;
  }[];
}

@Component({
  selector: 'team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  public FormArray = FormArray;
  public FormGroup = FormGroup;
  team: Team = {
    name: 'Angular Cookie Eaters',
    members:[
      {
        id: '100',
        firstName: 'Harpal',
        lastName: 'Singh',
        favColor: 'blue',
        favFood: 'chicken',
        expertiseLevel: 'Expert-Level'
      },
      {
        id: '101',
        firstName: 'Satinder',
        lastName: 'Kour',
        favColor: 'black',
        favFood: 'rajma',
        expertiseLevel: 'Mid-Level'
      },
      {
        id: '102',
        firstName: 'Hazel',
        lastName: 'Kour',
        favColor: 'pink',
        favFood: 'pizza',
        expertiseLevel: 'Entry-Level'
      }
    ]
  }

 teamFormGroup: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.teamFormGroup = this.fb.group({
      teamName: [this.team.name],
      members: this.fb.array(
        this.team.members.map(member => 
          this.fb.group({
            origData:member,
            favColor: [member.favColor],
            expertiseLevel:[member.expertiseLevel]
          }))
        )
    })
  }

  sortByFirstName(){
    const formValue = this.teamFormGroup.value as TeamFormValue
    formValue.members.sort((a,b) => a.origData.firstName < b.origData.firstName ? -1 : 1);
    this.addMembersFormGroups(formValue);
  }
  sortByFavColor(){
    const formValue = this.teamFormGroup.value as TeamFormValue
    formValue.members.sort((a,b) => a.favColor.localeCompare(b.favColor));
    this.addMembersFormGroups(formValue);
  }
  getOrigDataValue(member: FormGroup){
   // console.log('member', member)
    return member.get('origData').value;
  }
  getMembersFormArray(){
    //! TODO find implementation of this method
   return this.teamFormGroup.get('members') as FormArray;
  }
  // getMembersArrayOfFormGroups(): FormArray{
  //     // TODO find implementation of this method
  //     console.log('array',this.teamFormGroup.get('members'));
  //   return this.teamFormGroup.get('members') as FormArray;
  // }
  addMembersFormGroups(formValue: TeamFormValue){
    this.getMembersFormArray().clear();
    formValue.members.forEach(m =>
      this.getMembersFormArray().push(
        this.fb.group({
          origData: [m.origData],
          favColor: [m.favColor],
          expertiseLevel:[m.expertiseLevel]
        })
      ))
  }

}
