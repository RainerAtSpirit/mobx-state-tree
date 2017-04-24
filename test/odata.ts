import { recordActions, types, getSnapshot, onAction } from "../src"
import { test } from "ava"


const createTestFactories = () => {

    const FilterExpression = types.model("FilterExpression", {
        field: types.string,
        operator: types.string, // should be union of allowed operator 
        value: types.string // how to have a value: any?
    })

    const FilterGroup = types.model("FilterGroup", {
        logic: types.string, // what would be the equivilant of export type FilterLogic = 'or' | 'and'
        filters: types.array // how to allow either FilterExpression or FilterGroup?
    })

    const SortExpression = types.model("SortExpression", {
        field: types.string,
        dir: types.string // what would be the equivilant of export type SortDir = 'asc' | 'desc'
    })

    const Odata = types.model("Odata", {
        expand: types.array(types.string),
        select: types.array(types.string),
        orderby: types.array(SortExpression),
        filter: types.maybe(FilterGroup),
        top: types.withDefault(types.number, 30)
    })

    return { Odata }
}

test("it should create a factory", (t) => {
    const { Odata } = createTestFactories()

    const s = getSnapshot(Odata.create({}))

    t.deepEqual(s, { expand: [], filter: null, select: [], orderby: [], top: 30 })
})

test("it should create a factory with expand", (t) => {
    const { Odata } = createTestFactories()

    const s = getSnapshot(Odata.create({ expand: ['Tabs'] }))

    t.deepEqual(s, { expand: ['Tabs'], filter: null, select: [], orderby: [], top: 30 })
})

test("it should create a factory with select", (t) => {
    const { Odata } = createTestFactories()

    const s = getSnapshot(Odata.create({ select: ['Title', 'Id'] }))

    t.deepEqual(s, { expand: [], filter: null, select: ['Title', 'Id'], orderby: [], top: 30 })
})

test("it should create a factory with orderby", (t) => {
    const { Odata } = createTestFactories()

    const s = getSnapshot(Odata.create({ orderby: [{ field: 'Title', dir: 'asc' }] }))

    t.deepEqual(s, { expand: [], filter: null, select: [], orderby: [{ field: 'Title', dir: 'asc' }], top: 30 })
})

test("it should create a factory with filter", (t) => {
    const { Odata } = createTestFactories()
    const filter = {
        "logic": "and",
        "filters": [
            {
                "logic": "or",
                "filters": [
                    {
                        "field": "Title",
                        "operator": "startswith",
                        "value": "A"
                    },
                    {
                        "field": "Title",
                        "operator": "startswith",
                        "value": "B"
                    }
                ]
            },
            {
                "logic": "or",
                "filters": [
                    {
                        "field": "Priority",
                        "operator": "eq",
                        "value": "(1) High"
                    },
                    {
                        "field": "Priority",
                        "operator": "eq",
                        "value": "(2) Normal"
                    }
                ]
            }
        ]
    }

    const s = getSnapshot(Odata.create({ filter: filter}))

    t.deepEqual(s, { expand: [], filter: filter, select: [], orderby: [], top: 30 })
})

