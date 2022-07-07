import { TestBed } from "@angular/core/testing";
import {CoursesService} from './courses.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse, LESSONS } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe("CoursesService", () => {
  let course: CoursesService,
  httpTestingController: HttpTestingController;
  const changes: Partial<Course> = {titles: {description: 'Testing course'}},
  courseId: number = 12;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService
      ]
    });

    course = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  })


  it('should retrieve all course', () => {
    course.findAllCourses().subscribe(courses => {
      expect(courses).toBeTruthy('No courses returned');

      expect(courses.length).toBe(12, "Incorrect number of courses");

      const course = courses.find(c => c.id === 12);
      expect(course.titles.description).toBe("Angular Testing Course", "Not the correct course")
    });

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toEqual("GET");
    req.flush({payload: Object.values(COURSES)})
  })

  it("should retrieve one course by ID", () => {
    const courseID = 12;
    course.findCourseById(courseID).subscribe(course => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
    });
    const req = httpTestingController.expectOne(`/api/courses/${courseID}`);
    expect(req.request.method).toEqual("GET");
    req.flush(COURSES[12]);

  });

  it("should save the course data", () => {
    course.saveCourse(courseId, changes).subscribe(
      course => {
        expect(course).toBeTruthy();
        expect(course.id == courseId);
      }
    );

    let req = httpTestingController.expectOne(`/api/courses/${courseId}`);
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body.titles.description).toEqual(changes.titles.description);
    req.flush({
      ...COURSES[courseId],
      ...changes
    })
  });

  it("should give an error if save course fails", () => {
    course.saveCourse(courseId, changes).subscribe(
      () => fail('The save course operation should have failed'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );
    const req = httpTestingController.expectOne(`/api/courses/${courseId}`);
    expect(req.request.method).toEqual("PUT");
    req.flush('failed to save course', {status: 500, statusText: 'Internal Server Error'})
  });

  it("should find a list of lessons", () => {
    course.findLessons(courseId).subscribe(
      lessons => {
        expect(lessons).toBeTruthy();

        expect(lessons.length).toBe(3)
      }
    );

    const req = httpTestingController.expectOne(
      req => req.url === '/api/lessons');
      expect(req.request.method).toEqual("GET");
      expect(req.request.params.get("courseId")).toEqual("12");
      expect(req.request.params.get("filter")).toEqual("")
      expect(req.request.params.get("sortOrder")).toEqual("asc")
      expect(req.request.params.get("pageNumber")).toEqual("0")
      expect(req.request.params.get("pageSize")).toEqual("3");

      req.flush({
        payload: findLessonsForCourse(courseId).slice(0, 3)
      })
  })

  afterEach(() => {
    httpTestingController.verify();
  })
})
