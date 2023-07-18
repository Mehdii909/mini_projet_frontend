import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Produit} from "../model/ProduitModel";
import {environment} from "../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  constructor(private http: HttpClient) { }

  getAllProduits() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<Produit[]>(environment.url + '/produits', { headers });
  }

  addProduit(produit: {
    nom: string;
    prixUnitaire: number;
    quantite: number;
  }) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Produit>(environment.url + '/produits', produit, { headers });
  }

  updateProduit(id: number, produit: Produit) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<Produit>(environment.url + '/produits/' + id, produit, { headers });
  }

  deleteProduit(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(environment.url + '/produits/' + id, { headers });
  }

}
