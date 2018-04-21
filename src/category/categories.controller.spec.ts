import { CategoriesService } from "./categories.service";
import { CategoriesAdminController } from "./categories.controller";
import { Category } from "./category.entity";

describe('CategoriesAdminController', () => {
    let categoriesService: CategoriesService;
    let categoriesAdminController: CategoriesAdminController;

    beforeEach(() => {
        categoriesService = new CategoriesService(null);
        categoriesAdminController = new CategoriesAdminController(categoriesService);
    });

    it('Fetches all categories from categories service', async () => {
        let categoryMock = new Category();
        let categoriesServiceFindAllSpy = spyOn(categoriesService, 'findAll').and.returnValue([ categoryMock ]);
        let categories = categoriesAdminController.findAll();
        expect(categoriesServiceFindAllSpy).toHaveBeenCalledTimes(1);
        expect(await categories).toEqual([ categoryMock ]);
    });

    it('Fetches category with given id from categories service', async () => {
        let categoryMock = new Category();
        let categoriesServiceFindSpy = spyOn(categoriesService, 'find').and.returnValue(categoryMock);
        let category = categoriesAdminController.find({ id: 1 });
        expect(categoriesServiceFindSpy).toHaveBeenCalledWith(1);
        expect(await category).toEqual(categoryMock);
    });

    it('Creates category using category service', async () => {
        let categoryMock = new Category();
        let categoriesServiceCreateSpy = spyOn(categoriesService, 'create').and.returnValue(categoryMock);
        let body = { name: 'name', numbered: true };
        let category = await categoriesAdminController.create(body);
        expect(categoriesServiceCreateSpy).toHaveBeenCalledWith(body);
        expect(category).toEqual(categoryMock);
    });

    it('Updates category using category service', async () => {
        let categoryMock = new Category();
        let categoriesServiceUpdateSpy = spyOn(categoriesService, 'update').and.returnValue(categoryMock);
        let body = { name: 'name', numbered: false };
        let category = await categoriesAdminController.update({ id: 1 }, body);
        expect(categoriesServiceUpdateSpy).toHaveBeenCalledWith(1, body);
        expect(category).toEqual(categoryMock);
    });

    it('Deletes a category using category service', () => {
        let categoriesServiceDeleteSpy = spyOn(categoriesService, 'delete');
        categoriesAdminController.delete({ id: 1 });
        expect(categoriesServiceDeleteSpy).toHaveBeenCalledTimes(1);
    });
});