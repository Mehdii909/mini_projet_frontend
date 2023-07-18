import {Component, Inject, Input, OnInit} from '@angular/core';
import {Produit} from "../model/ProduitModel";
import {ProduitService} from "../service/produit.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";


@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.scss']
})
export class ProduitComponent implements OnInit {

  // @ts-ignore
  produits: Produit[];
  // @ts-ignore
  filteredData: any[] = [];
  searchText = '';

  constructor(
    private produitService: ProduitService,
    private dialog: MatDialog
  ) { }

  onSearchChange() {
    // Réinitialise le tableau filteredData
    this.filteredData = [];

    // Vérifie si le texte de recherche est vide
    if (!this.searchText) {
      this.filteredData = this.produits;
      return;
    }

    // Effectue la recherche en fonction du searchText
    // @ts-ignore
    this.filteredData = this.produits.filter(item => {
      // Customize the search criteria as per your requirements
      const fullSearch = `${item.nom}`.toLowerCase();
      return fullSearch.includes(this.searchText.toLowerCase());
    });
  }

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.produitService.getAllProduits().subscribe((data: Produit[]) => {
      this.produits = data;
      this.filteredData = data;
    });
  }

  deleteProduit(produitId: number): void {
    this.produitService.deleteProduit(produitId).subscribe(() => {
      this.loadProduits();
    });
  }

  openAddDialog(): void {
    // Ouvre le dialogue pour ajouter un produit
    const dialogRef = this.dialog.open(AddProduitDialogComponent, {
      width: '300px',
    });

    // S'abonne à l'événement après la fermeture du dialogue
    dialogRef.afterClosed().subscribe((result: Produit) => {
      // Vérifie si un résultat a été retourné depuis le dialogue
      if (result) {
        // Appelle le service pour ajouter le produit
        this.produitService.addProduit(result).subscribe(() => {
          // Recharge la liste des produits après l'ajout
          this.loadProduits();
        });
      }
    });
  }


  openEditDialog(id: number, nom: string, prixUnitaire: number, quantite: number): void {
    // Ouvre le dialogue pour modifier un produit
    const dialogRef = this.dialog.open(EditProduitDialogComponent, {
      width: '300px',
      data: { id, nom, prixUnitaire, quantite }
    });

    // S'abonne à l'événement après la fermeture du dialogue
    dialogRef.afterClosed().subscribe((result: Produit) => {
      // Vérifie si un résultat a été retourné depuis le dialogue
      if (result) {
        // Appelle le service pour mettre à jour le produit
        this.produitService.updateProduit(result.id, result).subscribe(() => {
          // Recharge la liste des produits après la mise à jour
          this.loadProduits();
        });
      }
    });
  }

  afficherProduit(id: number) {
    // Recherche le produit sélectionné dans le tableau des produits
    const selectedProduit = this.produits.find(produit => produit.id === id);

    // Ouvre le dialogue pour afficher les détails du produit
    const dialogRef = this.dialog.open(ProduitDetailsDialogComponent, {
      width: '400px',
      data: { produit: selectedProduit }
    });
  }


}

@Component({
  selector: 'app-add-produit-dialog',
  templateUrl: './add-produit-dialog.component.html',
  styleUrls: ['./produit.component.scss']
})
export class AddProduitDialogComponent implements OnInit {
  // @ts-ignore
  addProduitForm: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<AddProduitDialogComponent>,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.addProduitForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prixUnitaire: ['', Validators.required],
      quantite: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.addProduitForm.valid) {
      // @ts-ignore
      const produit: Produit = {
        nom: this.addProduitForm.value.nom,
        prixUnitaire: this.addProduitForm.value.prixUnitaire,
        quantite: this.addProduitForm.value.quantite
      };
      this.dialogRef.close(produit);
    }
  }
}


@Component({
  selector: 'app-edit-produit-dialog',
  templateUrl: './edit-produit-dialog.component.html',
  styleUrls: ['./produit.component.scss']
})
export class EditProduitDialogComponent implements OnInit {
  // @ts-ignore
  editProduitForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditProduitDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.editProduitForm = this.formBuilder.group({
      nom: [this.data.nom, Validators.required],
      prixUnitaire: [this.data.prixUnitaire, Validators.required],
      quantite: [this.data.quantite, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.editProduitForm.valid) {
      const produit: Produit = {
        id: this.data.id,
        nom: this.editProduitForm.value.nom,
        prixUnitaire: this.editProduitForm.value.prixUnitaire,
        quantite: this.editProduitForm.value.quantite
      };
      this.dialogRef.close(produit);
    }
  }
}


@Component({
  selector: 'app-produit-details-dialog',
  templateUrl: './produit-details-dialog.component.html',
  styleUrls: ['./produit.component.scss']
})
export class ProduitDetailsDialogComponent {
  @Input() produit: Produit;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.produit = data.produit;
  }
}
