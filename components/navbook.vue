<script setup>

</script>
<template>
    <div>
        <nav class="navbar">
            <span class="burger" onclick="toggleSidebar()">&#9776;</span>
            <a href="#" class="navbar-brand">
                <!-- <img src="Scribble monogram_color.png" alt="Logo" style="width: 50px;"> AssignmentX -->
            </a>
            <form class="form-inline">
                <input class="form-control" type="search" placeholder="Search" aria-label="Search">
            </form>
            <div class="ml-auto d-none d-md-flex">
                <a href="" class="btn btn-outline-primary">Make Purchase</a>
                <NuxtLink to="/about" class="btn btn-outline-success">About</NuxtLink>
                <a href="#" class="btn btn-outline-danger">Logout</a>
            </div>
            <div class="ml-auto d-md-none">
                <span class="burger" onclick="toggleMenu()">&#9776;</span>
            </div>

            <div class="mobile-menu d-none">
                <a href="#" class="btn btn-outline-primary">Buy the Book</a>
                <a href="about.html" class="btn btn-outline-success">About</a>
                <!-- <a href="#" class="btn btn-outline-danger">Logout</a> -->
            </div>
        </nav>

        <!-- sidebar -->
        <div class="sidebar" id="sidebar">
            <h5>Work Books</h5>
            <ul>
                <li class="workbook-card">
                    <a class="dropdown-toggle" href="numbers.html">Work Book One</a>
                    <ul class="dropdown-content">
                        <li><a href="numbers-vids.html">Numbers</a></li>
                        <li><a href="algebra-vids.html">Algebra</a></li>
                        <li><a href="gm-vids.html">Geometry and Measurement</a></li>
                        <li><a href="data-vids.html">Handling Data</a></li>
                    </ul>
                </li>
                <li class="workbook-card">
                    <a class="dropdown-toggle" href="#">Work Book Two</a>
                    <ul class="dropdown-content">
                        <li><a href="numbers-two-vids.html">Numbers</a></li>
                        <li><a href="algebra-two-vids.html">Algebra</a></li>
                        <li><a href="gm-two-vids.html">Geometry and Measurement</a></li>
                        <li><a href="data-two-vids.tml">Handling Data</a></li>
                    </ul>
                </li>
                <li class="workbook-card">
                    <a class="dropdown-toggle" href="#">Work Book Three</a>
                    <ul class="dropdown-content">
                        <li><a href="numbers-three-vids.html">Numbers</a></li>
                        <li><a href="algebra-three-vids.html">Algebra</a></li>
                        <li><a href="gm-three-vids.html">Geometry and Measurement</a></li>
                        <li><a href="data-three-vids.html">Handling Data</a></li>
                    </ul>
                </li>
            </ul>
            <h5>Settings</h5>
            <ul>
                <li><a href="#">Settings</a></li>
            </ul>
        </div>
    </div>
</template>
<style>
/* General Styles */
/* body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
} */

/* Navbar */
.navbar {
    background-color: #fff;
    padding: 15px;
    border-bottom: 3px solid green;
    position: fixed;
    z-index: 1000;
    width: 100%;
    margin-top: -80px;
}

.navbar-brand {
    font-weight: bold;
    font-size: 1.5rem;
}

.navbar input[type="search"] {
    border-radius: 50px;
    padding: 5px 15px;
    width: 300px;
}

/* Sidebar */
.sidebar {
    position: fixed;
    top: 0;
    left: -250px;
    height: 100%;
    width: 250px;
    background-color: #f8f9fa;
    transition: left 0.3s ease;
    padding-top: 20px;
    border-right: 1px solid #ddd;
    z-index: 1100;
    /* Ensure it's above the navbar and content */
}

.sidebar.active {
    left: 0;
}

.sidebar h5 {
    padding-left: 20px;
    margin-top: 20px;
    font-weight: bold;
}

.sidebar ul {
    list-style-type: none;
    padding: 0;
}

.sidebar ul li {
    padding: 10px 20px;
}

.sidebar ul li a {
    color: #000;
    text-decoration: none;
}

.sidebar ul li a:hover {
    color: #007bff;
}

/* Burger menu */
.burger {
    font-size: 1.5rem;
    cursor: pointer;
    padding-left: 20px;
    display: inline-block;
}

/* Main content */


@media (max-width: 576px) {
    .navbar input[type="search"] {
        width: 120px;
    }

    .related-videos {
        display: none;
        /* Hide related videos on very small screens */
    }
}
</style>