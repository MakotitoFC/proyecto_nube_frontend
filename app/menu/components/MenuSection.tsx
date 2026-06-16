import React from 'react';

const MenuSection = () => {
    return (
        <section className="py-24 bg-white font-principal">
            <div className="text-center mb-20 animate-fade-in-up">
                <span className="text-yellow-600 font-bold tracking-[0.2em] text-sm uppercase block mb-4">Food Menu</span>
                <h2 className="text-4xl md:text-6xl font-principal text-slate-800">Timeless Culinary Delights</h2>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">

                {/* Section 1: Starters & Appetizers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-12">
                        <div className="inline-block bg-orange-500 text-white px-8 py-2 text-sm font-bold skew-x-[-12deg] mb-8 shadow-lg">
                            <span className="block skew-x-[12deg] tracking-widest uppercase">Starters & Appetizers</span>
                        </div>

                        <div className="space-y-8">
                            <MenuItem
                                image="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                title="Spicy Potato Wedges"
                                description="Lorem ipsum dolor sit amet"
                                price="11"
                                badge="NEW"
                            />
                            <MenuItem
                                image="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                title="Vegetable Spring Rolls"
                                description="Lorem ipsum dolor sit amet"
                                price="12"
                                badge="POPULAR"
                            />
                            <MenuItem
                                image="https://images.unsplash.com/photo-1573821663912-569905455b1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                title="Garlic Bread with Cheese"
                                description="Lorem ipsum dolor sit amet"
                                price="10"
                                badge="NEW"
                            />
                            <MenuItem
                                image="https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                title="Greek Feta Salad"
                                description="Lorem ipsum dolor sit amet"
                                price="7"
                                badge="TRENDING"
                            />
                            <MenuItem
                                image="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                title="Mozzarella Sticks"
                                description="Lorem ipsum dolor sit amet"
                                price="15"
                                badge="CHEF'S SPECIAL"
                            />
                        </div>
                    </div>
                    <div className="relative h-[600px] hidden lg:block">
                        <img
                            src="https://images.unsplash.com/photo-1512485800893-cad88bb156ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Starters"
                            className="w-full h-full object-cover rounded-t-[200px] shadow-2xl"
                        />
                    </div>
                </div>

                {/* Section 2: Main Course */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative h-[600px] hidden lg:block order-last lg:order-first">
                        <img
                            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Main Course"
                            className="w-full h-full object-cover rounded-t-[200px] shadow-2xl"
                        />
                    </div>
                    <div className="space-y-12">
                        <div className="flex justify-end lg:justify-start">
                            <div className="inline-block bg-red-500 text-white px-8 py-2 text-sm font-bold skew-x-[-12deg] mb-8 shadow-lg">
                                <span className="block skew-x-[12deg] tracking-widest uppercase">Main Course</span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <MenuItem
                                image="https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                title="Pesto Zucchini Noodles"
                                description="Lorem ipsum dolor sit amet"
                                price="11"
                                badge="CHEF'S SPECIAL"
                            />
                            <MenuItem
                                image="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                title="Pepperoni Paradise Pie"
                                description="Lorem ipsum dolor sit amet"
                                price="13"
                                badge="TRENDING"
                            />
                            <MenuItem
                                image="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                title="Caprese Carnival Crust"
                                description="Lorem ipsum dolor sit amet"
                                price="15"
                                badge="NEW"
                            />
                            <MenuItem
                                image="https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                title="Quinoa Tacos"
                                description="Lorem ipsum dolor sit amet"
                                price="10"
                                badge="POPULAR"
                            />
                            <MenuItem
                                image="https://images.unsplash.com/photo-1617978255979-4d6d63df4819?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                title="Udon Noodles"
                                description="Lorem ipsum dolor sit amet"
                                price="6"
                                badge="MUST TRY"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Desserts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-12">
                        <div className="inline-block bg-orange-600 text-white px-8 py-2 text-sm font-bold skew-x-[-12deg] mb-8 shadow-lg">
                            <span className="block skew-x-[12deg] tracking-widest uppercase">Desserts</span>
                        </div>

                        <div className="space-y-8">
                            <MenuItem
                                image="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                title="Midnight Dunes"
                                description="Lorem ipsum dolor sit amet"
                                price="21"
                                badge="NEW"
                            />
                            <MenuItem
                                image="https://images.unsplash.com/photo-1563729768-7491b31b7b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                title="Desert Rose Cake"
                                description="Lorem ipsum dolor sit amet"
                                price="18"
                                badge="POPULAR"
                            />
                            <MenuItem
                                image="https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                title="Desert Breeze Cake"
                                description="Lorem ipsum dolor sit amet"
                                price="11"
                                badge="NEW"
                            />
                            <MenuItem
                                image="https://images.unsplash.com/photo-1551879400-111a9087cd86?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                title="Golden Oasis Cake"
                                description="Lorem ipsum dolor sit amet"
                                price="6"
                            />
                        </div>
                    </div>
                    <div className="relative h-[600px] hidden lg:block">
                        <img
                            src="https://images.unsplash.com/photo-1488477181946-6428a029177b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Desserts"
                            className="w-full h-full object-cover rounded-t-[200px] shadow-2xl"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

const MenuItem = ({ image, title, description, price, badge }: { image: string, title: string, description: string, price: string, badge?: string }) => (
    <div className="flex items-center gap-6 group hover:translate-x-2 transition-transform duration-300">
        <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-white flex-shrink-0">
            <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
            <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1 mb-1 relative">
                <h4 className="text-lg font-bold text-slate-800 bg-white pr-2 relative z-10">{title}</h4>
                <div className="flex items-center gap-2 bg-white pl-2 relative z-10">
                    {badge && (
                        <span className="text-[10px] uppercase font-bold text-orange-500 border border-orange-500 px-1 rounded-sm">
                            {badge}
                        </span>
                    )}
                    <span className="text-xl font-bold text-slate-800">${price}</span>
                </div>
                {/* Dotted line fill */}
                {/* <div className="absolute bottom-1 left-0 w-full border-b border-dotted border-slate-300 z-0"></div> */}
            </div>
            <p className="text-sm text-slate-500 font-principal italic">{description}</p>
        </div>
    </div>
);

export default MenuSection;
