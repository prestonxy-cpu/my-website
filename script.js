// 导航栏滚动效果
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// 移动端菜单切换
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// 点击导航链接后关闭菜单
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// 滚动渐入动画
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.about-grid, .service-card, .contact-item, .contact-form, .section-title, .section-subtitle').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// 表单提交处理
function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '已发送 ✓';
    btn.style.background = '#4a7c59';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        e.target.reset();
    }, 2000);
}
