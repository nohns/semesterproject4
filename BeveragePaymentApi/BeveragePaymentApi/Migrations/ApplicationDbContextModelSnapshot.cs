﻿// <auto-generated />
using System;
using BeveragePaymentApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BeveragePaymentApi.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("BeveragePaymentApi.Domain.Beverage", b =>
                {
                    b.Property<int>("BeverageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<double>("BasePrice")
                        .HasColumnType("double");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<string>("ImageSrc")
                        .HasColumnType("longtext");

                    b.Property<bool>("IsActive")
                        .HasColumnType("tinyint(1)");

                    b.Property<double>("MaxPrice")
                        .HasColumnType("double");

                    b.Property<double>("MinPrice")
                        .HasColumnType("double");

                    b.Property<string>("Name")
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<int>("TotalSales")
                        .HasColumnType("int");

                    b.HasKey("BeverageId");

                    b.ToTable("Beverages");
                });

            modelBuilder.Entity("BeveragePaymentApi.Domain.Entities.Order", b =>
                {
                    b.Property<int>("OrderId")
                        .HasColumnType("int");

                    b.Property<DateTime?>("ExpiryTime")
                        .HasColumnType("datetime(6)");

                    b.Property<int?>("PriceId")
                        .HasColumnType("int");

                    b.Property<int?>("StripeIntentId")
                        .HasColumnType("int");

                    b.Property<DateTime?>("TimeStamp")
                        .HasColumnType("datetime(6)");

                    b.HasKey("OrderId");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("BeveragePaymentApi.Domain.Entities.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Price", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<float>("Amount")
                        .HasColumnType("float");

                    b.Property<int>("BeverageId")
                        .HasColumnType("int");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("BeverageId");

                    b.ToTable("Prices");
                });

            modelBuilder.Entity("BeveragePaymentApi.Domain.Entities.Order", b =>
                {
                    b.HasOne("Price", "Price")
                        .WithOne("Order")
                        .HasForeignKey("BeveragePaymentApi.Domain.Entities.Order", "OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Price");
                });

            modelBuilder.Entity("Price", b =>
                {
                    b.HasOne("BeveragePaymentApi.Domain.Beverage", "Beverage")
                        .WithMany("Prices")
                        .HasForeignKey("BeverageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Beverage");
                });

            modelBuilder.Entity("BeveragePaymentApi.Domain.Beverage", b =>
                {
                    b.Navigation("Prices");
                });

            modelBuilder.Entity("Price", b =>
                {
                    b.Navigation("Order");
                });
#pragma warning restore 612, 618
        }
    }
}
