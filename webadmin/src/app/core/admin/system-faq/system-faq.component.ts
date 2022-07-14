import { Component, OnInit, TemplateRef } from '@angular/core';
import { AccordionConfig } from 'ngx-bootstrap/accordion';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { QuillModule } from 'ngx-quill';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FAQTitleService } from 'src/app/shared/services/FAQTitle/FAQTitle.service';
import { FAQCategoriesService } from 'src/app/shared/services/FAQCategories/FAQCategories.service';


export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), { closeOthers: true });
}

@Component({
  selector: 'app-system-faq',
  templateUrl: './system-faq.component.html',
  styleUrls: ['./system-faq.component.scss']
})
export class SystemFaqComponent implements OnInit {

  infoTable = []
  editFAQ = {category:"",categoryId:""}
  titleFAQForm: FormGroup
  categoryForm: FormGroup
  registerForm: FormGroup
  title


  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered"
  };

  modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button

      ["link"], // link and image, video
    ],
  };


  constructor(
    private modalService: BsModalService,
    private FAQTitleService: FAQTitleService,
    private FAQCategoriesService: FAQCategoriesService,
    private formBuilder: FormBuilder,
  ) {
    this.productGeneration2()
   }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      categoryId: new FormControl(""),
      category: new FormControl(""),
      active: new FormControl(""),
      content: new FormControl(""),
    });

    this.titleFAQForm = this.formBuilder.group({
      categoryId: new FormControl(""),
      category: new FormControl(""),
      active: new FormControl(""),
      content: new FormControl(""),
    });

  }

  newTitle() {
    console.log("qqqq");
    console.log(this.registerForm.value)
    this.FAQCategoriesService.post(this.registerForm.value).subscribe(
      () => {
        // Success
        // this.isLoading = false
        // this.successMessage();
        // this.loadingBar.complete();
        // this.successAlert("create project");
        this.register()
        this.productGeneration2()
        console.log("success")
      },
      () => {
        // Failed
        // this.isLoading = false
        // this.successMessage();
        // this.errorAlert("edit");
      },
      () => {
        // After
        // this.notifyService.openToastr("Success", "Welcome back");
        // this.navigateHomePage();
      }
    );
  }

  deleteTitle(){
    console.log(this.titleFAQForm.value.categoryId)
    this.FAQCategoriesService.delete(this.titleFAQForm.value.categoryId).subscribe(
      () => {
        this.productGeneration2()
        console.log("success")
      },
      () => {

      },
      () => {

      }
    );
  }

  editTitle() {
    console.log("qqqq");
    console.log(this.titleFAQForm.value.categoryId)
    this.editMessage()
    this.FAQCategoriesService.update(this.titleFAQForm.value.categoryId,this.titleFAQForm.value).subscribe(
      () => {
        // Success
        // this.isLoading = false
        // this.successMessage();
        // this.loadingBar.complete();
        // this.successAlert("create project");
        // window.location.reload();
        this.productGeneration2()
        console.log("success")
      },
      () => {

      },
      () => {

      }
    );
  }

  openModal(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide()
    this.titleFAQForm.reset()
  }

  confirm() {
    swal.fire({
      title: "Confirmation",
      text: "Are you sure to delete this title?",
      type: "info",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-info",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.value) {
        this.deleteTitle()
        this.deleteMessage()
      }
    })
  }

  register() {
    swal.fire({
      title: "Success",
      text: "A new title has been created!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.modal.hide()
        this.productGeneration2()
        this.titleFAQForm.reset()
      }
    })
  }

  deleteMessage() {
    swal.fire({
      title: "Success",
      text: "A title has been deleted!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.modal.hide()
        this.productGeneration2()
        this.titleFAQForm.reset()
      }
    })
  }

  editMessage() {
    swal.fire({
      title: "Success",
      text: "A title has been save!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.modal.hide()
        this.productGeneration2()
        this.titleFAQForm.reset()
      }
    })
  }

  productGeneration2() {
    this.FAQCategoriesService.get().subscribe(
      (res) => {
        this.infoTable = [...res]
        console.log("zzzzz2 = ",this.infoTable)

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key
          };
        });
      },
      () => {
        console.log("HTTP request completed.")
      }
    );
  }
  

  dropdownFAQ(event){
    console.log('event = ',event)
    this.FAQCategoriesService.getOne(event).subscribe(
      (res) => {
        // this.editFAQ.category = res.category
        // this.editFAQ.categoryId = res.categoryId
        this.titleFAQForm.patchValue(res)
        console.log(res)
        // this.infoTable = [...res]
        // console.log("zzzzz2 = ",this.infoTable)

        // this.infoTable = this.infoTable.map((prop, key) => {
        //   return {
        //     ...prop,
        //     id: key
        //   };
        // });
      },
      () => {
        console.log("HTTP request completed.")
      }
    );
  }

  newTitle2(){
    console.log("newTitle()",this.registerForm.value.TITLE)
  }

}


