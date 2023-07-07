let world1 = {
    "cols": 40,
    "rows": 40,
    "grid": [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5,
        1, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5,
        1, 3, 3, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 5, 5, 5,
        1, 2, 2, 2, 3, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5,
        1, 2, 2, 2, 3, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 5, 5, 5,
        1, 2, 2, 2, 3, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 3, 5, 5, 5,
        1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 3, 5, 5, 5,
        1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 1, 3, 4, 4, 4, 3, 5, 5, 5,
        1, 2, 3, 2, 2, 3, 3, 3, 1, 3, 4, 4, 4, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5,
        1, 3, 2, 2, 4, 4, 4, 3, 3, 3, 4, 4, 4, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5,
        1, 2, 2, 2, 4, 4, 4, 3, 3, 3, 3, 3, 3, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 4, 4, 3, 3, 3, 2, 2, 2, 3, 5, 5, 5,
        1, 3, 3, 3, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 2, 2, 3, 2, 2, 5, 5, 5,
        1, 3, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 5, 5, 5,
        1, 3, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 1, 1, 2, 3, 3, 2, 2, 3, 3, 3, 2, 3, 2, 3, 3, 5, 5, 5,
        1, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 3, 3, 3, 3, 1, 1, 1, 1, 1, 3, 2, 3, 2, 3, 2, 3, 3, 3, 2, 2, 3, 3, 5, 5, 5,
        1, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 3, 3, 3, 3, 1, 1, 1, 2, 3, 2, 3, 2, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5,
        1, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 3, 3, 2, 2, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5,
        1, 3, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 3, 3, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 3, 5, 5, 5,
        1, 3, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 3, 2, 3, 5, 5, 5,
        1, 3, 2, 2, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 3, 6, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 5, 5, 5,
        1, 3, 3, 3, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 3, 6, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 2, 3, 2, 2, 2, 3, 3, 5, 5, 5,
        1, 3, 3, 3, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 3, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 5, 5, 5,
        1, 3, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 5, 5, 5,
        1, 3, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 3, 3, 3, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5,
        1, 3, 2, 2, 4, 4, 4, 3, 3, 3, 1, 3, 4, 4, 4, 3, 3, 3, 3, 3, 5, 3, 3, 3, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5,
        1, 3, 3, 3, 4, 4, 4, 3, 3, 3, 3, 3, 4, 4, 4, 3, 3, 3, 3, 3, 5, 3, 3, 3, 4, 4, 4, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 5, 5, 5,
        1, 3, 3, 3, 4, 4, 4, 2, 3, 3, 3, 3, 4, 4, 4, 2, 2, 2, 3, 3, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5,
        1, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 3, 3, 3, 3, 3, 3, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 3, 3, 3, 5, 5, 5,
        1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 3, 3, 3, 5, 5, 5,
        1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 3, 4, 4, 4, 3, 3, 3, 3, 3, 6, 3, 3, 3, 4, 4, 4, 3, 3, 3, 4, 4, 4, 3, 5, 5, 5, 5, 5,
        1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 4, 4, 4, 3, 3, 3, 3, 5, 5, 3, 3, 3, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5,
        1, 3, 2, 2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 4, 4, 4, 3, 3, 3, 3, 5, 3, 3, 3, 3, 4, 4, 4, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5,
        1, 3, 2, 2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5,
        1, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 5, 3, 3, 5, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 5, 3, 3, 5, 5, 5, 5, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 3, 3, 5, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 3, 5, 3, 3, 5, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5
    ],
}
