import { Repository } from "typeorm";
import { CategoriesService } from "./categories.service";
import { Category, CategoryDto } from "./category.entity";

describe('CategoriesService', () => {
    let categoryRepository: Repository<Category>;
    let categoriesService: CategoriesService;

    beforeEach(() => {
        categoryRepository = new Repository<Category>();
        categoriesService = new CategoriesService(categoryRepository);
    });

    it('Fetches all categories from repository', async () => {
        let categoryMock = new Category();
        let categoryRepositoryFindSpy = spyOn(categoryRepository, 'find').and.returnValue([categoryMock]);
        let categories = await categoriesService.findAll();
        expect(categoryRepositoryFindSpy).toHaveBeenCalledTimes(1);
        expect(categories).toEqual([categoryMock]);
    });

    it('Fetches category with given id from repository', async () => {
        let categoryMock = new Category();
        let categoryRepositoryFindOneByIdSpy = spyOn(categoryRepository, 'findOneById').and.returnValue(categoryMock);
        let category = await categoriesService.find(1);
        expect(categoryRepositoryFindOneByIdSpy).toHaveBeenCalledWith(1);
        expect(category).toEqual(categoryMock);
    });

    it('Creates category with given property values', async () => {
        let categoryMock = new Category();
        let categoryDtoMock = {
            name: 'dto.name',
            color: '#f33',
            price: 20,
            price_reduced: 10
        };

        let categoryRepositoryCreateSpy = spyOn(categoryRepository, 'create').and.returnValue(categoryMock);
        let categoryRepositorySaveSpy = spyOn(categoryRepository, 'save').and.returnValue(categoryMock);
        let category = await categoriesService.create(categoryDtoMock);
        
        expect(categoryRepositoryCreateSpy).toHaveBeenCalledTimes(1);
        expect(categoryRepositorySaveSpy).toHaveBeenCalledWith(categoryMock);
        
        expect(category).toEqual(categoryMock);
        expect(category.name).toEqual(categoryDtoMock.name);
        expect(category.color).toEqual('#f33');
        expect(category.price).toEqual(categoryDtoMock.price);
        expect(category.price_reduced).toEqual(categoryDtoMock.price_reduced);
    });

    it('Updates category with given property values', async () => {
        let categoryMock = new Category();
        categoryMock.name = 'model.name';
        categoryMock.color = '#f33';
        categoryMock.price = 20;
        categoryMock.price_reduced = 10;

        let categoryDtoMock = {
            name: 'dto.name',
            color: '#3ff',
            price: 21,
            price_reduced: 11
        };

        let categoryRepositoryFindOneByIdSpy = spyOn(categoryRepository, 'findOneById').and.returnValue(categoryMock);
        let categoryRepositorySaveSpy = spyOn(categoryRepository, 'save').and.returnValue(categoryMock);
        let category = await categoriesService.update(1, categoryDtoMock);

        expect(categoryRepositoryFindOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(categoryRepositorySaveSpy).toHaveBeenCalledWith(categoryMock);
        
        expect(category).toEqual(categoryMock);
        expect(category.name).toEqual(categoryDtoMock.name);
        expect(category.color).toEqual(categoryDtoMock.color);
        expect(category.price).toEqual(categoryDtoMock.price);
        expect(category.price_reduced).toEqual(categoryDtoMock.price_reduced);
    });

    it('Updates category with no property values', async () => {
        let categoryMock = new Category();
        categoryMock.name = 'model.name';
        categoryMock.color = '#f33';
        categoryMock.price = 20;
        categoryMock.price_reduced = 10;

        let categoryDtoMock = { };

        let categoryRepositoryFindOneByIdSpy = spyOn(categoryRepository, 'findOneById').and.returnValue(categoryMock);
        let categoryRepositorySaveSpy = spyOn(categoryRepository, 'save').and.returnValue(categoryMock);
        let category = await categoriesService.update(1, categoryDtoMock);

        expect(categoryRepositoryFindOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(categoryRepositorySaveSpy).toHaveBeenCalledWith(categoryMock);
        
        expect(category).toEqual(categoryMock);
        expect(category.name).toEqual(categoryMock.name);
        expect(category.color).toEqual(categoryMock.color);
        expect(category.price).toEqual(categoryMock.price);
        expect(category.price_reduced).toEqual(categoryMock.price_reduced);
    });

    it('Deletes category with given id using repository', async () => {
        let categoryRepositoryDeleteSpy = spyOn(categoryRepository, 'delete');
        await categoriesService.delete(1);
        expect(categoryRepositoryDeleteSpy).toHaveBeenCalledWith({ id: 1 });
    });
});