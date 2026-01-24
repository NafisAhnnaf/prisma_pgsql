import { createDepartment, createDepartmentAllocation, deleteDepartmentAllocation, getAllDepartments, getDepartmentBySlug, deleteDepartmentBySlug, updateDepartmentBySlug } from "../controllers/department.controller.ts";
import { Router } from "express";


const router = Router();


router.get('/', getAllDepartments);
router.get('/:slug', getDepartmentBySlug);
router.post('/', createDepartment);
router.post('/add-member', createDepartmentAllocation);
router.patch('/:slug', updateDepartmentBySlug)
router.delete('/remove-member/:id', deleteDepartmentAllocation);//Junction table ID not member id or dept id;
router.delete('/:slug', deleteDepartmentBySlug);


export default router;
