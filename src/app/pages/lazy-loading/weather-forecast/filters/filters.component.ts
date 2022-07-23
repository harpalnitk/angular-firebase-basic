import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { LocationService } from '../services/location.service';
import { DropdownService } from '../services/dropdown.service';

@Component({
  selector: 'wc-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  cities: any;
  countries: any;
  states: any;
  locationData: any;

  constructor(
    private locationService: LocationService,
    private dialogRef: MatDialogRef<FiltersComponent>,
    private dropdownService: DropdownService
  ) { }

  loadDropdownData(ipData: any) {
    this.getCountries();
    console.log('ipData loadDropdownData',ipData)
    this.getRegions(ipData.country_code);
    this.getCities(ipData.country_code, ipData.region);
  }

  ngOnInit() {
    this.locationService.getIPData().subscribe();
    this.locationService.ipDataGetter().subscribe(ipData => {
      console.log('ipData in filter', ipData);
      this.locationData = this.locationService.ipData;
      if(ipData){
        console.log('ipData2',ipData)
        console.log('locationData',this.locationData)
        this.loadDropdownData(this.locationData);
      }
      
    });
  }

  getCities(countryCode: string, regionName: string) {
    this.dropdownService.getCities(countryCode, regionName).subscribe(
      cities => {
        this.cities = cities;
      }
    );
  }

  getCountries() {
    this.dropdownService.getCountries().subscribe(
      countries => {
        console.log('countries data',countries)
        this.countries = countries}
    );
  }

  getRegions(regionName: string) {
    this.dropdownService.getRegions(regionName).subscribe(
      states => {
        this.states = states;
      }
    );
  }

  close(data?: any) {
    this.dialogRef.close(data);
  }

}
